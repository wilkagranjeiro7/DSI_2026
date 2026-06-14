import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

      {/* 🔍 BARRA DE BUSCA FLUTUANTE REINTRODUZIDA */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.backButtonInner} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Buscar academias, boxes ou parques..."
            placeholderTextColor="#9CA3AF"
            value={busca}
            onChangeText={(txt) => {
              setBusca(txt);
              setMostrarSugestoes(true);
            }}
            onFocus={() => setMostrarSugestoes(true)}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => { setBusca(""); setLocalSelecionado(null); }}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* 📋 AUTOCOMPLETE: LISTA DE SUGESTÕES */}
        {mostrarSugestoes && listaSugestoes.length > 0 && (
          <View style={styles.suggestionsBox}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
              {listaSugestoes.map((local) => (
                <TouchableOpacity
                  key={local.id}
                  style={styles.suggestionItem}
                  onPress={() => selecionarLocalDaSugestao(local)}
                >
                  <MaterialCommunityIcons
                    name={local.tipo === "publico" ? "tree-outline" : "dumbbell"}
                    size={18}
                    color="#6B7280"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.suggestionText} numberOfLines={1}>
                    {local.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* 🎛️ FILTROS DE PESQUISA REINTRODUZIDOS */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          <TouchableOpacity
            style={[styles.filterBtn, apenasGratis && styles.filterBtnActive]}
            onPress={() => {
              setApenasGratis(!apenasGratis);
              setApenasPagas(false);
            }}
          >
            <Ionicons name="leaf" size={14} color={apenasGratis ? "#FFF" : "#10B981"} />
            <Text style={[styles.filterBtnText, apenasGratis && styles.filterBtnTextActive]}>Gratuitos / Públicos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, apenasPagas && styles.filterBtnActivePrivado]}
            onPress={() => {
              setApenasPagas(!apenasPagas);
              setApenasGratis(false);
            }}
          >
            <MaterialCommunityIcons name="dumbbell" size={14} color={apenasPagas ? "#FFF" : "#F29111"} />
            <Text style={[styles.filterBtnText, apenasPagas && styles.filterBtnTextActive]}>Privados / Pagos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, filtrarFavoritos && styles.filterBtnActiveFav]}
            onPress={() => setFiltrarFavoritos(!filtrarFavoritos)}
          >
            <Ionicons name="heart" size={14} color={filtrarFavoritos ? "#FFF" : "#EF4444"} />
            <Text style={[styles.filterBtnText, filtrarFavoritos && styles.filterBtnTextActive]}>Meus Favoritos</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 🎴 CARD DE DETALHES DO LOCAL SELECIONADO */}
      {localSelecionado && (
        <View style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{localSelecionado.nome}</Text>
              <Text style={[styles.cardBadge, localSelecionado.tipo === "publico" ? styles.badgePublico : styles.badgePrivado]}>
                {localSelecionado.tipo === "publico" ? "Público / Grátis" : "Privado / Pago"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => gerenciarFavorito(localSelecionado.id)} style={styles.favBtn}>
              <Ionicons
                name={favoritos.includes(localSelecionado.id) ? "heart" : "heart-outline"}
                size={26}
                color="#EF4444"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardDesc}>{localSelecionado.descricao}</Text>

          <View style={styles.cardInfoRow}>
            <Ionicons name="time-outline" size={16} color="#4B5563" style={{ marginRight: 6 }} />
            <Text style={styles.cardInfoText}>{localSelecionado.horario}</Text>
          </View>

          <View style={styles.tagsContainer}>
            {localSelecionado.tags.map((tag, idx) => (
              <Text key={idx} style={styles.tagItem}>#{tag}</Text>
            ))}
          </View>
        </View>
      )}

      <BottomNavbar active="mapa" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
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
  
  // Estilos da Barra de Busca Superior
  searchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 54,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButtonInner: {
    marginRight: 10,
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  suggestionsBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 6,
    padding: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  suggestionText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  // Estilos dos Filtros Horizontais
  filtersContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 116 : 106,
    left: 0,
    right: 0,
    zIndex: 90,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
    height: 40,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 34,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginRight: 6,
  },
  filterBtnActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  filterBtnActivePrivado: { backgroundColor: "#F29111", borderColor: "#F29111" },
  filterBtnActiveFav: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  filterBtnText: { fontSize: 12, fontWeight: "700", color: "#4B5563", marginLeft: 6 },
  filterBtnTextActive: { color: "#FFF" },

  // Estilos dos Marcadores (Pins) do Mapa
  pinBubble: { padding: 8, borderRadius: 20, elevation: 4 },
  pinPublico: { backgroundColor: "#10B981" },
  pinPrivado: { backgroundColor: "#F29111" },
  pinSelected: { transform: [{ scale: 1.25 }], borderWidth: 2, borderColor: "#FFF" },

  // Estilos do Card de Detalhes de Baixo
  detailsCard: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 80,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "900", color: "#111827", marginBottom: 4 },
  cardBadge: {
    alignSelf: "flex-start",
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  badgePublico: { backgroundColor: "#D1FAE5", color: "#065F46" },
  badgePrivado: { backgroundColor: "#FFEDD5", color: "#9A3412" },
  favBtn: { padding: 4 },
  cardDesc: { fontSize: 13, color: "#4B5563", lineHeight: 18, marginBottom: 12 },
  cardInfoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardInfoText: { fontSize: 12, fontWeight: "600", color: "#4B5563" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tagItem: { fontSize: 11, fontWeight: "700", color: "#F28C1B" },
});