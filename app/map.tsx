import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { Component, createRef } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "../src/components/BottomNavbar";

class MapComponents {
  static MapView: any = View;
  static Marker: any = View;

  static configure() {
    if (Platform.OS !== "web") {
      const Maps = require("react-native-maps");
      this.MapView = Maps.default || Maps;
      this.Marker = Maps.Marker;
    }
  }
}

MapComponents.configure();

class LocalTreino {
  constructor(
    readonly id: string,
    readonly nome: string,
    readonly descricao: string,
    readonly latitude: number,
    readonly longitude: number,
    readonly tipo: "publico" | "privado",
    readonly tags: string[],
    readonly horario: string,
  ) {}
}

class LocalService {
  private static readonly todosOsLocais: LocalTreino[] = [
    new LocalTreino(
      "1",
      "Academia Recife - Polo Jaqueira",
      "Aparelhos em aco inox, acompanhamento de instrutores e musculacao gratuita.",
      -8.0367,
      -34.9046,
      "publico",
      ["gratis", "musculacao", "jaqueira", "ao ar livre"],
      "05:30 as 09:30 | 17:00 as 21:00",
    ),
    new LocalTreino(
      "2",
      "Academia Recife - Polo Santana",
      "Espaco integrado ao parque, excelente para treinos funcionais e alongamento.",
      -8.0418,
      -34.9168,
      "publico",
      ["gratis", "funcional", "santana", "ao ar livre"],
      "05:30 as 09:30 | 17:00 as 21:00",
    ),
    new LocalTreino(
      "3",
      "Academia Recife - Polo Macaxeira",
      "Unidade com foco em musculacao basica e espaco integrado de cross training publico.",
      -8.0153,
      -34.9322,
      "publico",
      ["gratis", "crossfit", "cross training", "macaxeira"],
      "05:30 as 09:30 | 17:00 as 21:00",
    ),
    new LocalTreino(
      "4",
      "Academia Recife - Polo Boa Viagem",
      "Musculacao gratuita na praia. Treine com o visual do mar de Boa Viagem.",
      -8.1144,
      -34.8942,
      "publico",
      ["gratis", "musculacao", "boa viagem", "praia"],
      "05:30 as 09:30 | 17:00 as 21:00",
    ),
    new LocalTreino(
      "5",
      "CrossFit FitMatch Torre",
      "Box de alta performance parceiro do app FitMatch com vestiario e coach.",
      -8.048,
      -34.915,
      "privado",
      ["pago", "crossfit", "torre", "premium"],
      "06:00 as 22:00",
    ),
    new LocalTreino(
      "6",
      "Selfit Academias - Madalena",
      "Estrutura completa de musculacao, area de cardio moderna e aulas de ginastica.",
      -8.0532,
      -34.9075,
      "privado",
      ["pago", "musculacao", "ginastica", "madalena"],
      "05:00 as 23:00",
    ),
    new LocalTreino(
      "7",
      "Smart Fit - Espinheiro",
      "Unidade climatizada com area de peso livre, aparelhos modernos e Smart Box.",
      -8.0392,
      -34.896,
      "privado",
      ["pago", "musculacao", "espinheiro"],
      "06:00 as 23:00",
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
      "Musculacao e danca gratuita na beira do Rio Capibaribe, na Iputinga.",
      -8.0435,
      -34.9298,
      "publico",
      ["gratis", "musculacao", "danca", "caiara", "iputinga"],
      "05:30 as 09:30 | 17:00 as 21:00",
    ),
    new LocalTreino(
      "10",
      "Galo CrossFit - Casa Forte",
      "Treinamento de alta intensidade, comunidade unida e coaches certificados.",
      -8.0295,
      -34.9212,
      "privado",
      ["pago", "crossfit", "casa forte"],
      "06:00 as 21:00",
    ),
  ];

  static filtrarLocais(
    termo: string,
    apenasFavoritos: boolean,
    listaFavoritosIds: string[],
  ): LocalTreino[] {
    let listagem = this.todosOsLocais;

    if (apenasFavoritos) {
      listagem = listagem.filter((local) =>
        listaFavoritosIds.includes(local.id),
      );
    }

    if (!termo || termo.trim() === "") {
      return listagem;
    }

    const termoLimpo = termo.toLowerCase().trim();

    return listagem.filter(
      (local) =>
        local.nome.toLowerCase().includes(termoLimpo) ||
        local.tags.some((tag) => tag.toLowerCase().includes(termoLimpo)),
    );
  }
}

class PremiumMapStyle {
  static readonly value: any = [
    { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
  ];
}

interface MapState {
  busca: string;
  apenasGratis: boolean;
  apenasPagas: boolean;
  filtrarFavoritos: boolean;
  favoritos: string[];
  localSelecionado: LocalTreino | null;
  mostrarSugestoes: boolean;
}

export default class MapScreen extends Component<object, MapState> {
  private readonly mapRef = createRef<any>();

  state: MapState = {
    busca: "",
    apenasGratis: false,
    apenasPagas: false,
    filtrarFavoritos: false,
    favoritos: [],
    localSelecionado: null,
    mostrarSugestoes: false,
  };

  private readonly regiaoInicial = {
    latitude: -8.045,
    longitude: -34.91,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  private get locaisParaExibir() {
    const { busca, filtrarFavoritos, favoritos, apenasGratis, apenasPagas } =
      this.state;
    let locais = LocalService.filtrarLocais(busca, filtrarFavoritos, favoritos);

    if (apenasGratis) {
      locais = locais.filter((local) => local.tipo === "publico");
    }

    if (apenasPagas) {
      locais = locais.filter((local) => local.tipo === "privado");
    }

    return locais;
  }

  private get listaSugestoes() {
    if (!this.state.busca || this.state.busca.trim() === "") {
      return [];
    }

    return LocalService.filtrarLocais(this.state.busca, false, []);
  }

  private centralizarEm = (lat: number, lng: number) => {
    if (
      this.mapRef.current &&
      typeof this.mapRef.current.animateToRegion === "function"
    ) {
      this.mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        400,
      );
    }
  };

  private selecionarLocalDaSugestao = (local: LocalTreino) => {
    this.setState({
      busca: local.nome,
      localSelecionado: local,
      mostrarSugestoes: false,
    });
    this.centralizarEm(local.latitude, local.longitude);
  };

  private gerenciarFavorito = (id: string) => {
    this.setState((estadoAtual) => ({
      favoritos: estadoAtual.favoritos.includes(id)
        ? estadoAtual.favoritos.filter((favId) => favId !== id)
        : [...estadoAtual.favoritos, id],
    }));
  };

  private limparBusca = () => {
    this.setState({ busca: "", localSelecionado: null });
  };

  private renderMarker(local: LocalTreino) {
    const Marker = MapComponents.Marker;
    const { localSelecionado } = this.state;

    return (
      <Marker
        key={local.id}
        coordinate={{
          latitude: local.latitude,
          longitude: local.longitude,
        }}
        onPress={(e: any) => {
          e.stopPropagation();
          this.setState({ localSelecionado: local });
          this.centralizarEm(local.latitude, local.longitude);
        }}
      >
        <View
          style={[
            styles.pinBubble,
            local.tipo === "publico" ? styles.pinPublico : styles.pinPrivado,
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
    );
  }

  private renderMap() {
    const MapView = MapComponents.MapView;

    if (Platform.OS === "web") {
      return (
        <View style={styles.webFallbackContainer}>
          <Ionicons name="map-outline" size={80} color="#D1D5DB" />
          <Text style={styles.webFallbackTitle}>Mapa indisponivel na Web</Text>
        </View>
      );
    }

    return (
      <MapView
        ref={this.mapRef}
        style={styles.map}
        initialRegion={this.regiaoInicial}
        customMapStyle={PremiumMapStyle.value}
        onPress={() => {
          this.setState({ localSelecionado: null, mostrarSugestoes: false });
        }}
      >
        {this.locaisParaExibir.map((local) => this.renderMarker(local))}
      </MapView>
    );
  }

  private renderSugestoes() {
    if (!this.state.mostrarSugestoes || this.listaSugestoes.length === 0) {
      return null;
    }

    return (
      <View style={styles.suggestionsBox}>
        <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
          {this.listaSugestoes.map((local) => (
            <TouchableOpacity
              key={local.id}
              style={styles.suggestionItem}
              onPress={() => this.selecionarLocalDaSugestao(local)}
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
    );
  }

  private renderDetalhes() {
    const { localSelecionado, favoritos } = this.state;

    if (!localSelecionado) {
      return null;
    }

    return (
      <View style={styles.detailsCard}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{localSelecionado.nome}</Text>
            <Text
              style={[
                styles.cardBadge,
                localSelecionado.tipo === "publico"
                  ? styles.badgePublico
                  : styles.badgePrivado,
              ]}
            >
              {localSelecionado.tipo === "publico"
                ? "Publico / Gratis"
                : "Privado / Pago"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.gerenciarFavorito(localSelecionado.id)}
            style={styles.favBtn}
          >
            <Ionicons
              name={
                favoritos.includes(localSelecionado.id) ? "heart" : "heart-outline"
              }
              size={26}
              color="#EF4444"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardDesc}>{localSelecionado.descricao}</Text>

        <View style={styles.cardInfoRow}>
          <Ionicons
            name="time-outline"
            size={16}
            color="#4B5563"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.cardInfoText}>{localSelecionado.horario}</Text>
        </View>

        <View style={styles.tagsContainer}>
          {localSelecionado.tags.map((tag, idx) => (
            <Text key={idx} style={styles.tagItem}>
              #{tag}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  render() {
    const {
      busca,
      apenasGratis,
      apenasPagas,
      filtrarFavoritos,
    } = this.state;

    return (
      <View style={styles.container}>
        {this.renderMap()}

        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TouchableOpacity
              style={styles.backButtonInner}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color="#111827" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Buscar academias, boxes ou parques..."
              placeholderTextColor="#9CA3AF"
              value={busca}
              onChangeText={(txt) => {
                this.setState({ busca: txt, mostrarSugestoes: true });
              }}
              onFocus={() => this.setState({ mostrarSugestoes: true })}
            />
            {busca.length > 0 && (
              <TouchableOpacity onPress={this.limparBusca}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          {this.renderSugestoes()}
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            <TouchableOpacity
              style={[styles.filterBtn, apenasGratis && styles.filterBtnActive]}
              onPress={() => {
                this.setState({
                  apenasGratis: !apenasGratis,
                  apenasPagas: false,
                });
              }}
            >
              <Ionicons
                name="leaf"
                size={14}
                color={apenasGratis ? "#FFF" : "#10B981"}
              />
              <Text
                style={[
                  styles.filterBtnText,
                  apenasGratis && styles.filterBtnTextActive,
                ]}
              >
                Gratuitos / Publicos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterBtn,
                apenasPagas && styles.filterBtnActivePrivado,
              ]}
              onPress={() => {
                this.setState({
                  apenasPagas: !apenasPagas,
                  apenasGratis: false,
                });
              }}
            >
              <MaterialCommunityIcons
                name="dumbbell"
                size={14}
                color={apenasPagas ? "#FFF" : "#F29111"}
              />
              <Text
                style={[
                  styles.filterBtnText,
                  apenasPagas && styles.filterBtnTextActive,
                ]}
              >
                Privados / Pagos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterBtn,
                filtrarFavoritos && styles.filterBtnActiveFav,
              ]}
              onPress={() =>
                this.setState({ filtrarFavoritos: !filtrarFavoritos })
              }
            >
              <Ionicons
                name="heart"
                size={14}
                color={filtrarFavoritos ? "#FFF" : "#EF4444"}
              />
              <Text
                style={[
                  styles.filterBtnText,
                  filtrarFavoritos && styles.filterBtnTextActive,
                ]}
              >
                Meus Favoritos
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {this.renderDetalhes()}

        <BottomNavbar active="mapa" />
      </View>
    );
  }
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
  filterBtnActivePrivado: {
    backgroundColor: "#F29111",
    borderColor: "#F29111",
  },
  filterBtnActiveFav: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  filterBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
    marginLeft: 6,
  },
  filterBtnTextActive: { color: "#FFF" },
  pinBubble: { padding: 8, borderRadius: 20, elevation: 4 },
  pinPublico: { backgroundColor: "#10B981" },
  pinPrivado: { backgroundColor: "#F29111" },
  pinSelected: {
    transform: [{ scale: 1.25 }],
    borderWidth: 2,
    borderColor: "#FFF",
  },
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 4,
  },
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
  cardDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 12,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfoText: { fontSize: 12, fontWeight: "600", color: "#4B5563" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tagItem: { fontSize: 11, fontWeight: "700", color: "#F28C1B" },
});
