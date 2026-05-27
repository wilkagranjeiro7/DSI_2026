import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import BottomNavbar from "../src/components/BottomNavbar";

// --- O TRUQUE: IMPORTAÇÃO DINÂMICA DO MAPA ---
let MapView: any = View;
let Marker: any = View;

if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default || Maps;
  Marker = Maps.Marker;
}

// --- CAMADA DE ORIENTAÇÃO A OBJETOS (OO) ---

class LocalTreino {
  id: string;
  nome: string;
  descricao: string;
  latitude: number;
  longitude: number;
  tipo: "publico" | "privado";
  tags: string[];
  horario: string;

  constructor(
    id: string,
    nome: string,
    desc: string,
    lat: number,
    lng: number,
    tipo: "publico" | "privado",
    tags: string[],
    horario: string,
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = desc;
    this.latitude = lat;
    this.longitude = lng;
    this.tipo = tipo;
    this.tags = tags;
    this.horario = horario;
  }
}

class LocalService {
  private static todosOsLocais: LocalTreino[] = [
    new LocalTreino(
      "1",
      "Academia Recife - Polo Jaqueira",
      "Aparelhos em aço inox, acompanhamento de instrutores e musculação gratuita.",
      -8.0367,
      -34.9046,
      "publico",
      ["gratis", "musculacao", "jaqueira", "ao ar livre"],
      "05:30 às 09:30 | 17:00 às 21:00",
    ),
    new LocalTreino(
      "2",
      "Academia Recife - Polo Santana",
      "Espaço integrado ao parque, excelente para treinos funcionais e alongamento.",
      -8.0418,
      -34.9168,
      "publico",
      ["gratis", "funcional", "santana", "ao ar livre"],
      "05:30 às 09:30 | 17:00 às 21:00",
    ),
    new LocalTreino(
      "3",
      "Academia Recife - Polo Macaxeira",
      "Unidade com foco em musculação básica e espaço integrado de cross training público.",
      -8.0153,
      -34.9322,
      "publico",
      ["gratis", "crossfit", "cross training", "macaxeira"],
      "05:30 às 09:30 | 17:00 às 21:00",
    ),
    new LocalTreino(
      "4",
      "Academia Recife - Polo Boa Viagem",
      "Musculação gratuita na praia. Treine com o visual do mar de Boa Viagem.",
      -8.1144,
      -34.8942,
      "publico",
      ["gratis", "musculacao", "boa viagem", "praia"],
      "05:30 às 09:30 | 17:00 às 21:00",
    ),
    new LocalTreino(
      "5",
      "CrossFit FitMatch Torre",
      "Box de alta performance parceiro do app FitMatch com vestiário e coach.",
      -8.048,
      -34.915,
      "privado",
      ["pago", "crossfit", "torre", "premium"],
      "06:00 às 22:00",
    ),
    new LocalTreino(
      "6",
      "Selfit Academias - Madalena",
      "Estrutura completa de musculação, área de cardio moderna e aulas de ginástica.",
      -8.0532,
      -34.9075,
      "privado",
      ["pago", "musculacao", "ginastica", "madalena"],
      "05:00 às 23:00",
    ),
    new LocalTreino(
      "7",
      "Smart Fit - Espinheiro",
      "Unidade climatizada com área de peso livre, aparelhos modernos e Smart Box.",
      -8.0392,
      -34.896,
      "privado",
      ["pago", "musculacao", "espinheiro"],
      "06:00 às 23:00",
    ),
    new LocalTreino(
      "8",
      "Parque Dona Lindu",
      "Esplanada excelente para corrida, patins, skate e treinos funcionais na praia.",
      -8.1419,
      -34.9032,
      "publico",
      ["gratis", "corrida", "funcional", "boa viagem"],
      "Aberto 24h",
    ),
    new LocalTreino(
      "9",
      "Polo Academia Recife - Parque Caiara",
      "Musculação e dança gratuita na beira do Rio Capibaribe, na Iputinga.",
      -8.0435,
      -34.9298,
      "publico",
      ["gratis", "musculacao", "danca", "caiara", "iputinga"],
      "05:30 às 09:30 | 17:00 às 21:00",
    ),
    new LocalTreino(
      "10",
      "Galo CrossFit - Casa Forte",
      "Treinamento de alta intensidade, comunidade unida e coaches certificados.",
      -8.0295,
      -34.9212,
      "privado",
      ["pago", "crossfit", "casa forte"],
      "06:00 às 21:00",
    ),
  ];

  static filtrarLocais(
    termo: string,
    apenasFavoritos: boolean,
    listaFavoritosIds: string[],
  ): LocalTreino[] {
    let listagem = this.todosOsLocais;
    if (apenasFavoritos)
      listagem = listagem.filter((local) =>
        listaFavoritosIds.includes(local.id),
      );
    if (!termo || termo.trim() === "") return listagem;
    const termoLimpo = termo.toLowerCase().trim();
    return listagem.filter(
      (local) =>
        local.nome.toLowerCase().includes(termoLimpo) ||
        local.tags.some((tag) => tag.toLowerCase().includes(termoLimpo)),
    );
  }
}

// CORREÇÃO: Estilo correto para o Google Maps e tipado como any
const PremiumMapStyle: any = [
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<any>(null);

  const [busca, setBusca] = useState("");
  const [apenasGratis, setApenasGratis] = useState(false);
  const [apenasPagas, setApenasPagas] = useState(false);
  const [filtrarFavoritos, setFiltrarFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [localSelecionado, setLocalSelecionado] = useState<LocalTreino | null>(
    null,
  );
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const regiaoInicial = {
    latitude: -8.045,
    longitude: -34.91,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  const locaisParaExibir = useMemo(() => {
    let locais = LocalService.filtrarLocais(busca, filtrarFavoritos, favoritos);
    if (apenasGratis) locais = locais.filter((l) => l.tipo === "publico");
    if (apenasPagas) locais = locais.filter((l) => l.tipo === "privado");
    return locais;
  }, [busca, filtrarFavoritos, apenasGratis, apenasPagas, favoritos]);

  const listaSugestoes = useMemo(() => {
    if (!busca || busca.trim() === "") return [];
    return LocalService.filtrarLocais(busca, false, []);
  }, [busca]);

  const centralizarEm = useCallback((lat: number, lng: number) => {
    if (
      mapRef.current &&
      typeof mapRef.current.animateToRegion === "function"
    ) {
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        400,
      );
    }
  }, []);

  const selecionarLocalDaSugestao = (local: LocalTreino) => {
    setBusca(local.nome);
    setLocalSelecionado(local);
    setMostrarSugestoes(false);
    centralizarEm(local.latitude, local.longitude);
  };

  const gerenciarFavorito = (id: string) => {
    if (favoritos.includes(id))
      setFavoritos(favoritos.filter((favId) => favId !== id));
    else setFavoritos([...favoritos, id]);
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <View style={styles.webFallbackContainer}>
          <Ionicons name="map-outline" size={80} color="#D1D5DB" />
          <Text style={styles.webFallbackTitle}>Mapa indisponível na Web</Text>
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={regiaoInicial}
          customMapStyle={PremiumMapStyle}
          onPress={() => {
            setLocalSelecionado(null);
            setMostrarSugestoes(false);
          }}
        >
          {locaisParaExibir.map((local) => (
            <Marker
              key={local.id}
              coordinate={{
                latitude: local.latitude,
                longitude: local.longitude,
              }}
              onPress={(e: any) => {
                e.stopPropagation();
                setLocalSelecionado(local);
                centralizarEm(local.latitude, local.longitude);
              }}
            >
              <View
                style={[
                  styles.pinBubble,
                  local.tipo === "publico"
                    ? styles.pinPublico
                    : styles.pinPrivado,
                  localSelecionado?.id === local.id && styles.pinSelected,
                ]}
              >
                <MaterialCommunityIcons
                  name={local.tipo === "publico" ? "tree" : "dumbbell"}
                  size={16}
                  color="#FFF"
                />
              </View>
            </Marker>
          ))}
        </MapView>
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
      <BottomNavbar active="mapa" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  webFallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webFallbackTitle: { fontSize: 18, color: "#6B7280" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  pinBubble: { padding: 8, borderRadius: 20 },
  pinPublico: { backgroundColor: "#10B981" },
  pinPrivado: { backgroundColor: "#F29111" },
  pinSelected: { transform: [{ scale: 1.2 }] },
});
