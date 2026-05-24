import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// --- CAMADA DE ORIENTAÇÃO A OBJETOS (OO) ---

class LocalTreino {
  id: string;
  nome: string;
  descricao: string;
  latitude: number;
  longitude: number;
  tipo: 'publico' | 'privado';
  tags: string[];
  horario: string;

  constructor(id: string, nome: string, desc: string, lat: number, lng: number, tipo: 'publico' | 'privado', tags: string[], horario: string) {
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
      "1", "Academia Recife - Polo Jaqueira",
      "Aparelhos em aço inox, acompanhamento de instrutores e musculação gratuita.",
      -8.0367, -34.9046, 'publico', ["gratis", "musculacao", "jaqueira", "ao ar livre"], "05:30 às 09:30 | 17:00 às 21:00"
    ),
    new LocalTreino(
      "2", "Academia Recife - Polo Santana",
      "Espaço integrado ao parque, excelente para treinos funcionais e alongamento.",
      -8.0418, -34.9168, 'publico', ["gratis", "funcional", "santana", "ao ar livre"], "05:30 às 09:30 | 17:00 às 21:00"
    ),
    new LocalTreino(
      "3", "Academia Recife - Polo Macaxeira",
      "Unidade com foco em musculação básica e espaço integrado de cross training público.",
      -8.0153, -34.9322, 'publico', ["gratis", "crossfit", "cross training", "macaxeira"], "05:30 às 09:30 | 17:00 às 21:00"
    ),
    new LocalTreino(
      "4", "Academia Recife - Polo Boa Viagem",
      "Musculação gratuita na praia. Treine com o visual do mar de Boa Viagem.",
      -8.1144, -34.8942, 'publico', ["gratis", "musculacao", "boa viagem", "praia"], "05:30 às 09:30 | 17:00 às 21:00"
    ),
    new LocalTreino(
      "5", "CrossFit FitMatch Torre",
      "Box de alta performance parceiro do app FitMatch com vestiário e coach.",
      -8.0480, -34.9150, 'privado', ["pago", "crossfit", "torre", "premium"], "06:00 às 22:00"
    ),
    new LocalTreino(
      "6", "Selfit Academias - Madalena",
      "Estrutura completa de musculação, área de cardio moderna e aulas de ginástica.",
      -8.0532, -34.9075, 'privado', ["pago", "musculacao", "ginastica", "madalena"], "05:00 às 23:00"
    ),
    new LocalTreino(
      "7", "Smart Fit - Espinheiro",
      "Unidade climatizada com área de peso livre, aparelhos modernos e Smart Box.",
      -8.0392, -34.8960, 'privado', ["pago", "musculacao", "espinheiro"], "06:00 às 23:00"
    ),
    new LocalTreino(
      "8", "Parque Dona Lindu",
      "Esplanada excelente para corrida, patins, skate e treinos funcionais na praia.",
      -8.1419, -34.9032, 'publico', ["gratis", "corrida", "funcional", "boa viagem"], "Aberto 24h"
    ),
    new LocalTreino(
      "9", "Polo Academia Recife - Parque Caiara",
      "Musculação e dança gratuita na beira do Rio Capibaribe, na Iputinga.",
      -8.0435, -34.9298, 'publico', ["gratis", "musculacao", "danca", "caiara", "iputinga"], "05:30 às 09:30 | 17:00 às 21:00"
    ),
    new LocalTreino(
      "10", "Galo CrossFit - Casa Forte",
      "Treinamento de alta intensidade, comunidade unida e coaches certificados.",
      -8.0295, -34.9212, 'privado', ["pago", "crossfit", "casa forte"], "06:00 às 21:00"
    )
  ];

  static filtrarLocais(termo: string, apenasFavoritos: boolean, listaFavoritosIds: string[]): LocalTreino[] {
    let listagem = this.todosOsLocais;

    if (apenasFavoritos) {
      listagem = listagem.filter(local => listaFavoritosIds.includes(local.id));
    }

    if (!termo || termo.trim() === '') return listagem;

    const termoLimpo = termo.toLowerCase().trim();
    return listagem.filter(local => 
      local.nome.toLowerCase().includes(termoLimpo) ||
      local.tags.some(tag => tag.toLowerCase().includes(termoLimpo))
    );
  }
}

const PremiumMapStyle = [
  { "featureType": "poi.business", "styled": { "visibility": "off" } },
  { "featureType": "transit", "styled": { "visibility": "off" } }
];

// --- COMPONENTE DA TELA ---

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  
  const [busca, setBusca] = useState('');
  const [apenasGratis, setApenasGratis] = useState(false);
  const [apenasPagas, setApenasPagas] = useState(false);
  const [filtrarFavoritos, setFiltrarFavoritos] = useState(false);
  
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [localSelecionado, setLocalSelecionado] = useState<LocalTreino | null>(null);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const regiaoInicial = { 
    latitude: -8.0450, 
    longitude: -34.9100, 
    latitudeDelta: 0.08, 
    longitudeDelta: 0.08 
  };

  const locaisParaExibir = useMemo(() => {
    let locais = LocalService.filtrarLocais(busca, filtrarFavoritos, favoritos);
    if (apenasGratis) {
      locais = locais.filter(l => l.tipo === 'publico');
    }
    if (apenasPagas) {
      locais = locais.filter(l => l.tipo === 'privado');
    }
    return locais;
  }, [busca, filtrarFavoritos, apenasGratis, apenasPagas, favoritos]);

  const listaSugestoes = useMemo(() => {
    if (!busca || busca.trim() === '') return [];
    return LocalService.filtrarLocais(busca, false, []);
  }, [busca]);

  const centralizarEm = useCallback((lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 400);
    }
  }, []);

  const selecionarLocalDaSugestao = (local: LocalTreino) => {
    setBusca(local.nome);
    setLocalSelecionado(local);
    setMostrarSugestoes(false);
    centralizarEm(local.latitude, local.longitude);
  };

  const gerenciarFavorito = (id: string) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  return (
    <View style={styles.container}>
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
        {locaisParaExibir.map((local) => {
          const isFav = favoritos.includes(local.id);
          return (
            <Marker
              key={local.id}
              coordinate={{ latitude: local.latitude, longitude: local.longitude }}
              onPress={(e) => { 
                e.stopPropagation(); 
                setLocalSelecionado(local);
                setMostrarSugestoes(false);
                centralizarEm(local.latitude, local.longitude);
              }}
            >
              <View style={[styles.pinBubble, local.tipo === 'publico' ? styles.pinPublico : styles.pinPrivado, localSelecionado?.id === local.id && styles.pinSelected]}>
                <MaterialCommunityIcons 
                  name={local.tipo === 'publico' ? "tree" : "dumbbell"} 
                  size={16} 
                  color="#FFF" 
                />
              </View>
              {isFav && (
                <View style={styles.miniHeartBadge}>
                  <Ionicons name="heart" size={10} color="#FFF" />
                </View>
              )}
              <View style={[styles.pinArrow, local.tipo === 'publico' ? { backgroundColor: '#10B981' } : { backgroundColor: '#F29111' }]} />
            </Marker>
          );
        })}
      </MapView>

      {/* BOTÃO FLUTUANTE DE VOLTAR */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      {/* PAINEL DE BUSCA COM AUTOCOMPLETE EMBUTIDO */}
      <View style={styles.topContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar por nome, bairro..."
            placeholderTextColor="#9CA3AF"
            value={busca}
            onChangeText={(text) => {
              setBusca(text);
              setMostrarSugestoes(true);
            }}
            onFocus={() => setMostrarSugestoes(true)}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => { setBusca(''); setMostrarSugestoes(false); }} style={{ marginRight: 10 }}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* MENU DE SUGESTÕES (AUTOCOMPLETE) */}
        {mostrarSugestoes && listaSugestoes.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
              {listaSugestoes.map((local) => (
                <TouchableOpacity 
                  key={local.id} 
                  style={styles.suggestionItem}
                  onPress={() => selecionarLocalDaSugestao(local)}
                >
                  <MaterialCommunityIcons 
                    name={local.tipo === 'publico' ? "tree" : "dumbbell"} 
                    size={18} 
                    color={local.tipo === 'publico' ? '#10B981' : '#F29111'} 
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.suggestionTextName} numberOfLines={1}>{local.nome}</Text>
                    <Text style={styles.suggestionTextTags} numberOfLines={1}>{local.tags.join(' • ')}</Text>
                  </View>
                  <Ionicons name="arrow-forward-outline" size={14} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* TRÊS CHIPS DE FILTRO */}
        <View style={styles.chipsRow}>
          <TouchableOpacity 
            style={[styles.chip, apenasGratis && styles.chipActive]} 
            onPress={() => {
              setApenasGratis(!apenasGratis);
              if(!apenasGratis) setApenasPagas(false);
            }}
          >
            <Ionicons name="gift-outline" size={14} color={apenasGratis ? "#FFF" : "#4B5563"} />
            <Text style={[styles.chipText, apenasGratis && styles.chipTextActive]}>Parques / Grátis</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, apenasPagas && styles.chipActivePrivado]} 
            onPress={() => {
              setApenasPagas(!apenasPagas);
              if(!apenasPagas) setApenasGratis(false);
            }}
          >
            <MaterialCommunityIcons name="dumbbell" size={14} color={apenasPagas ? "#FFF" : "#4B5563"} />
            <Text style={[styles.chipText, apenasPagas && styles.chipTextActive]}>Academias</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, filtrarFavoritos && styles.chipActiveFav]} 
            onPress={() => setFiltrarFavoritos(!filtrarFavoritos)}
          >
            <Ionicons name={filtrarFavoritos ? "heart" : "heart-outline"} size={14} color={filtrarFavoritos ? "#FFF" : "#4B5563"} />
            <Text style={[styles.chipText, filtrarFavoritos && styles.chipTextActive]}>Favoritos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTÃO FLUTUANTE DE CENTRALIZAR */}
      <TouchableOpacity 
        style={styles.centerButton}
        onPress={() => centralizarEm(regiaoInicial.latitude, regiaoInicial.longitude)}
      >
        <Ionicons name="locate" size={24} color="#F29111" />
      </TouchableOpacity>

      {/* CARD DETALHADO DO LOCAL SELECIONADO */}
      {localSelecionado && !mostrarSugestoes && (
        <View style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{localSelecionado.nome}</Text>
              <Text style={styles.cardSubtitle}>
                {localSelecionado.tipo === 'publico' ? '🟢 Polo Público Gratuito' : '🟠 Academia Parceira'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => gerenciarFavorito(localSelecionado.id)} style={styles.heartButton}>
              <Ionicons 
                name={favoritos.includes(localSelecionado.id) ? "heart" : "heart-outline"} 
                size={26} 
                color="#EF4444" 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardDescription}>{localSelecionado.descricao}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#4B5563" style={{ marginRight: 6 }} />
            <Text style={styles.infoText}>{localSelecionado.horario}</Text>
          </View>

          <TouchableOpacity style={styles.routeButton} onPress={() => Alert.alert("GPS", `Traçando rota para ${localSelecionado.nome}`)}>
            <MaterialCommunityIcons name="navigation" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.routeButtonText}>Treinar aqui hoje</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// --- CAMADA ESTILIZADA COMPLETA ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  backButton: {
    position: 'absolute',
    top: 50,
    left: '5%',
    backgroundColor: '#FFF',
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 11,
  },
  topContainer: { position: 'absolute', top: 50, left: '21%', right: '5%', gap: 10, zIndex: 10 },
  searchBox: { backgroundColor: '#FFF', borderRadius: 16, height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, elevation: 4 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#111827' },
  suggestionsContainer: { backgroundColor: '#FFF', borderRadius: 16, marginTop: -4, elevation: 5, paddingVertical: 4, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  suggestionTextName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  suggestionTextTags: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  chipsRow: { flexDirection: 'row', gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20, elevation: 2, gap: 4 },
  chipActive: { backgroundColor: '#10B981' },
  chipActivePrivado: { backgroundColor: '#F29111' },
  chipActiveFav: { backgroundColor: '#EF4444' },
  chipText: { fontSize: 11, fontWeight: '600', color: '#4B5563' },
  chipTextActive: { color: '#FFF' },
  pinBubble: { padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  pinPublico: { backgroundColor: '#10B981' },
  pinPrivado: { backgroundColor: '#F29111' },
  pinSelected: { transform: [{ scale: 1.25 }], borderColor: '#111827', borderWidth: 2 },
  pinArrow: { width: 6, height: 6, transform: [{ rotate: '45deg' }], alignSelf: 'center', marginTop: -4 },
  miniHeartBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', borderRadius: 8, width: 14, height: 14, alignItems: 'center', justifyContent: 'center' },
  centerButton: { position: 'absolute', bottom: 310, right: 20, backgroundColor: '#FFF', width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', elevation: 4, zIndex: 1 },
  detailsCard: { position: 'absolute', bottom: 30, width: '90%', alignSelf: 'center', backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 10, zIndex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  cardSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: '600' },
  heartButton: { padding: 4 },
  cardDescription: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoText: { fontSize: 12, color: '#4B5563', fontWeight: '500' },
  routeButton: { backgroundColor: '#F29111', height: 48, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  routeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});