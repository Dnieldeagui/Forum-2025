const southWest = L.latLng(-25.5, -48.5);
const northEast = L.latLng(-17.5, -38.5);
const boundsSudeste = L.latLngBounds(southWest, northEast);

// Defina o nível de zoom inicial e mínimo aqui
const zoomDesejado = 7; 

const map = L.map('map', {
    maxBounds: boundsSudeste,
    minZoom: zoomDesejado, // O mapa não vai conseguir dar zoom out além disso
    maxZoom: 18,
    zoomSnap: 0.5 // Garante que o nível de zoom inicial caia em um valor válido
});

// Centraliza o mapa nos limites definidos
map.fitBounds(boundsSudeste);

// Se quiser garantir que ele nunca vá abaixo do zoom inicial (opcional)
map.setMinZoom(zoomDesejado);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Adiciona tiles do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Variáveis globais
let locais = [];
let marcadores = [];
let marcadorAtual = null;

// Elementos DOM
const spanDecibeis = document.getElementById("decibeis");
const spanAtualizacao = document.getElementById("atualizacao");
const themeToggle = document.getElementById("theme-toggle");
const noiseBar = document.getElementById("noise-bar");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMapBtn = document.getElementById("mobile-map-btn");
const mobileInfoBtn = document.getElementById("mobile-info-btn");
const infoPanel = document.getElementById("info");
const mapContainer = document.getElementById("map");

// Função para carregar dados do backend
async function carregarDados() {
try {
    const response = await fetch('http://localhost:8000/api/dados');
    const data = await response.json();

    locais = data.locais; // Atualiza a variável global

    // Adiciona os marcadores no mapa
    adicionarMarcadores();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);       

        // Fallback: usa dados estáticos se API falhar
    }
locais = [
    { 
        nome: "Rio de Janeiro", 
        coords: [-22.9068, -43.1729], 
        decibeis: 72, 
        densidade: 5265,
        latitude: -22.9068,
        longitude: -43.1729,
        poluicao_sonora_prevista: 72,
        frota_veiculos: 3134989
    },
    { 
        nome: "Angra dos Reis", 
        coords: [-23.0067, -44.3181], 
        decibeis: 58, 
        densidade: 205.84,
        latitude: -23.0067,
        longitude: -44.3181,
        poluicao_sonora_prevista: 58,
        frota_veiculos: 54451
    },
    { 
        nome: "Aperibé", 
        coords: [-21.6253, -42.1028], 
        decibeis: 52, 
        densidade: 116.71,
        latitude: -21.6253,
        longitude: -42.1028,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Araruama", 
        coords: [-22.8728, -42.3428], 
        decibeis: 57, 
        densidade: 203.16,
        latitude: -22.8728,
        longitude: -42.3428,
        poluicao_sonora_prevista: 57,
        frota_veiculos: 57140
    },
    { 
        nome: "Areal", 
        coords: [-22.2286, -43.1058], 
        decibeis: 53, 
        densidade: 106.82,
        latitude: -22.2286,
        longitude: -43.1058,
        poluicao_sonora_prevista: 53,
        frota_veiculos: 15000
    },
    { 
        nome: "Armação dos Búzios", 
        coords: [-22.7472, -41.8814], 
        decibeis: 61, 
        densidade: 563.65,
        latitude: -22.7472,
        longitude: -41.8814,
        poluicao_sonora_prevista: 61,
        frota_veiculos: 15000
    },
    { 
        nome: "Arraial do Cabo", 
        coords: [-22.9661, -42.0278], 
        decibeis: 57, 
        densidade: 203.71,
        latitude: -22.9661,
        longitude: -42.0278,
        poluicao_sonora_prevista: 57,
        frota_veiculos: 15000
    },
    { 
        nome: "Barra do Piraí", 
        coords: [-22.4711, -43.8256], 
        decibeis: 56, 
        densidade: 158.88,
        latitude: -22.4711,
        longitude: -43.8256,
        poluicao_sonora_prevista: 56,
        frota_veiculos: 32797
    },
    { 
        nome: "Barra Mansa", 
        coords: [-22.5439, -44.1708], 
        decibeis: 59, 
        densidade: 310.52,
        latitude: -22.5439,
        longitude: -44.1708,
        poluicao_sonora_prevista: 59,
        frota_veiculos: 68027
    },
    { 
        nome: "Belford Roxo", 
        coords: [-22.7639, -43.3991], 
        decibeis: 85, 
        densidade: 6116.19,
        latitude: -22.7639,
        longitude: -43.3991,
        poluicao_sonora_prevista: 85,
        frota_veiculos: 97316
    },
    { 
        nome: "Bom Jardim", 
        coords: [-22.1550, -42.4250], 
        decibeis: 54, 
        densidade: 73.48,
        latitude: -22.1550,
        longitude: -42.4250,
        poluicao_sonora_prevista: 54,
        frota_veiculos: 15000
    },
    { 
        nome: "Bom Jesus do Itabapoana", 
        coords: [-21.1353, -41.6794], 
        decibeis: 52, 
        densidade: 58.95,
        latitude: -21.1353,
        longitude: -41.6794,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Cabo Frio", 
        coords: [-22.8784, -42.0196], 
        decibeis: 62, 
        densidade: 537.34,
        latitude: -22.8784,
        longitude: -42.0196,
        poluicao_sonora_prevista: 62,
        frota_veiculos: 95545
    },
    { 
        nome: "Cachoeiras de Macacu", 
        coords: [-22.4658, -42.6522], 
        decibeis: 52, 
        densidade: 59.64,
        latitude: -22.4658,
        longitude: -42.6522,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Cambuci", 
        coords: [-21.5753, -41.9111], 
        decibeis: 51, 
        densidade: 26.18,
        latitude: -21.5753,
        longitude: -41.9111,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Campos dos Goytacazes", 
        coords: [-21.7523, -41.3304], 
        decibeis: 56, 
        densidade: 119.91,
        latitude: -21.7523,
        longitude: -41.3304,
        poluicao_sonora_prevista: 56,
        frota_veiculos: 248200
    },
    { 
        nome: "Cantagalo", 
        coords: [-21.9803, -42.3683], 
        decibeis: 51, 
        densidade: 25.95,
        latitude: -21.9803,
        longitude: -42.3683,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Carapebus", 
        coords: [-22.1872, -41.6631], 
        decibeis: 52, 
        densidade: 45.42,
        latitude: -22.1872,
        longitude: -41.6631,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Cardoso Moreira", 
        coords: [-21.4872, -41.6164], 
        decibeis: 51, 
        densidade: 24.8,
        latitude: -21.4872,
        longitude: -41.6164,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Carmo", 
        coords: [-21.9358, -42.6086], 
        decibeis: 52, 
        densidade: 56.25,
        latitude: -21.9358,
        longitude: -42.6086,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Casimiro de Abreu", 
        coords: [-22.4811, -42.2044], 
        decibeis: 54, 
        densidade: 99.61,
        latitude: -22.4811,
        longitude: -42.2044,
        poluicao_sonora_prevista: 54,
        frota_veiculos: 15000
    },
    { 
        nome: "Comendador Levy Gasparian", 
        coords: [-22.0286, -43.2086], 
        decibeis: 53, 
        densidade: 80.46,
        latitude: -22.0286,
        longitude: -43.2086,
        poluicao_sonora_prevista: 53,
        frota_veiculos: 15000
    },
    { 
        nome: "Conceição de Macabu", 
        coords: [-22.0853, -41.8681], 
        decibeis: 52, 
        densidade: 62.39,
        latitude: -22.0853,
        longitude: -41.8681,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Cordeiro", 
        coords: [-22.0286, -42.3619], 
        decibeis: 57, 
        densidade: 183.84,
        latitude: -22.0286,
        longitude: -42.3619,
        poluicao_sonora_prevista: 57,
        frota_veiculos: 15000
    },
    { 
        nome: "Duas Barras", 
        coords: [-22.0533, -42.5239], 
        decibeis: 51, 
        densidade: 28.92,
        latitude: -22.0533,
        longitude: -42.5239,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Duque de Caxias", 
        coords: [-22.7854, -43.3047], 
        decibeis: 78, 
        densidade: 1729.36,
        latitude: -22.7854,
        longitude: -43.3047,
        poluicao_sonora_prevista: 78,
        frota_veiculos: 330367
    },
    { 
        nome: "Engenheiro Paulo de Frontin", 
        coords: [-22.5486, -43.6764], 
        decibeis: 53, 
        densidade: 87.83,
        latitude: -22.5486,
        longitude: -43.6764,
        poluicao_sonora_prevista: 53,
        frota_veiculos: 15000
    },
    { 
        nome: "Guapimirim", 
        coords: [-22.5372, -42.9819], 
        decibeis: 55, 
        densidade: 144.22,
        latitude: -22.5372,
        longitude: -42.9819,
        poluicao_sonora_prevista: 55,
        frota_veiculos: 15000
    },
    { 
        nome: "Iguaba Grande", 
        coords: [-22.8389, -42.2289], 
        decibeis: 62, 
        densidade: 547.7,
        latitude: -22.8389,
        longitude: -42.2289,
        poluicao_sonora_prevista: 62,
        frota_veiculos: 15000
    },
    { 
        nome: "Itaboraí", 
        coords: [-22.7475, -42.8591], 
        decibeis: 62, 
        densidade: 521.6,
        latitude: -22.7475,
        longitude: -42.8591,
        poluicao_sonora_prevista: 62,
        frota_veiculos: 75956
    },
    { 
        nome: "Itaguaí", 
        coords: [-22.8522, -43.7753], 
        decibeis: 61, 
        densidade: 413.44,
        latitude: -22.8522,
        longitude: -43.7753,
        poluicao_sonora_prevista: 61,
        frota_veiculos: 46330
    },
    { 
        nome: "Italva", 
        coords: [-21.4236, -41.6914], 
        decibeis: 52, 
        densidade: 48.33,
        latitude: -21.4236,
        longitude: -41.6914,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Itaocara", 
        coords: [-21.6722, -42.0761], 
        decibeis: 52, 
        densidade: 52.91,
        latitude: -21.6722,
        longitude: -42.0761,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Itaperuna", 
        coords: [-21.2053, -41.8878], 
        decibeis: 55, 
        densidade: 91.3,
        latitude: -21.2053,
        longitude: -41.8878,
        poluicao_sonora_prevista: 55,
        frota_veiculos: 41097
    },
    { 
        nome: "Itatiaia", 
        coords: [-22.4917, -44.5633], 
        decibeis: 56, 
        densidade: 128.23,
        latitude: -22.4917,
        longitude: -44.5633,
        poluicao_sonora_prevista: 56,
        frota_veiculos: 15000
    },
    { 
        nome: "Japeri", 
        coords: [-22.6436, -43.6531], 
        decibeis: 70, 
        densidade: 1178.61,
        latitude: -22.6436,
        longitude: -43.6531,
        poluicao_sonora_prevista: 70,
        frota_veiculos: 15000
    },
    { 
        nome: "Laje do Muriaé", 
        coords: [-21.2072, -42.1272], 
        decibeis: 51, 
        densidade: 28.94,
        latitude: -21.2072,
        longitude: -42.1272,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Macaé", 
        coords: [-22.3700, -41.7869], 
        decibeis: 57, 
        densidade: 202.46,
        latitude: -22.3700,
        longitude: -41.7869,
        poluicao_sonora_prevista: 57,
        frota_veiculos: 108329
    },
    { 
        nome: "Macuco", 
        coords: [-21.9842, -42.2533], 
        decibeis: 53, 
        densidade: 69.1,
        latitude: -21.9842,
        longitude: -42.2533,
        poluicao_sonora_prevista: 53,
        frota_veiculos: 15000
    },
    { 
        nome: "Magé", 
        coords: [-22.6528, -43.0406], 
        decibeis: 63, 
        densidade: 583.78,
        latitude: -22.6528,
        longitude: -43.0406,
        poluicao_sonora_prevista: 63,
        frota_veiculos: 61928
    },
    { 
        nome: "Mangaratiba", 
        coords: [-22.9594, -44.0406], 
        decibeis: 55, 
        densidade: 112.13,
        latitude: -22.9594,
        longitude: -44.0406,
        poluicao_sonora_prevista: 55,
        frota_veiculos: 15000
    },
    { 
        nome: "Maricá", 
        coords: [-22.9194, -42.8186], 
        decibeis: 62, 
        densidade: 545.61,
        latitude: -22.9194,
        longitude: -42.8186,
        poluicao_sonora_prevista: 62,
        frota_veiculos: 15000
    },
    { 
        nome: "Mendes", 
        coords: [-22.5267, -43.7328], 
        decibeis: 61, 
        densidade: 483.61,
        latitude: -22.5267,
        longitude: -43.7328,
        poluicao_sonora_prevista: 61,
        frota_veiculos: 53714
    },
    { 
        nome: "Mesquita", 
        coords: [-22.7828, -43.4289], 
        decibeis: 82, 
        densidade: 4059.54,
        latitude: -22.7828,
        longitude: -43.4289,
        poluicao_sonora_prevista: 82,
        frota_veiculos: 15000
    },
    { 
        nome: "Miguel Pereira", 
        coords: [-22.4539, -43.4689], 
        decibeis: 55, 
        densidade: 92.32,
        latitude: -22.4539,
        longitude: -43.4689,
        poluicao_sonora_prevista: 55,
        frota_veiculos: 41008
    },
    { 
        nome: "Miracema", 
        coords: [-21.4122, -42.1967], 
        decibeis: 54, 
        densidade: 88.64,
        latitude: -21.4122,
        longitude: -42.1967,
        poluicao_sonora_prevista: 54,
        frota_veiculos: 15000
    },
    { 
        nome: "Natividade", 
        coords: [-21.0422, -41.9733], 
        decibeis: 52, 
        densidade: 38.94,
        latitude: -21.0422,
        longitude: -41.9733,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Nilópolis", 
        coords: [-22.8056, -43.4133], 
        decibeis: 85, 
        densidade: 7568.4,
        latitude: -22.8056,
        longitude: -43.4133,
        poluicao_sonora_prevista: 85,
        frota_veiculos: 15000
    },
    { 
        nome: "Niterói", 
        coords: [-22.8834, -43.1034], 
        decibeis: 74, 
        densidade: 3601.67,
        latitude: -22.8834,
        longitude: -43.1034,
        poluicao_sonora_prevista: 74,
        frota_veiculos: 50307
    },
    { 
        nome: "Nova Friburgo", 
        coords: [-22.2819, -42.5311], 
        decibeis: 57, 
        densidade: 203.05,
        latitude: -22.2819,
        longitude: -42.5311,
        poluicao_sonora_prevista: 57,
        frota_veiculos: 290045
    },
    { 
        nome: "Nova Iguaçu", 
        coords: [-22.7556, -43.4603], 
        decibeis: 76, 
        densidade: 1509.6,
        latitude: -22.7556,
        longitude: -43.4603,
        poluicao_sonora_prevista: 76,
        frota_veiculos: 111215
    },
    { 
        nome: "Paracambi", 
        coords: [-22.6089, -43.7108], 
        decibeis: 58, 
        densidade: 216.68,
        latitude: -22.6089,
        longitude: -43.7108,
        poluicao_sonora_prevista: 58,
        frota_veiculos: 307092
    },
    { 
        nome: "Paraíba do Sul", 
        coords: [-22.1589, -43.2931], 
        decibeis: 54, 
        densidade: 73.65,
        latitude: -22.1589,
        longitude: -43.2931,
        poluicao_sonora_prevista: 54,
        frota_veiculos: 15000
    },
    { 
        nome: "Paraty", 
        coords: [-23.2178, -44.7131], 
        decibeis: 52, 
        densidade: 48.95,
        latitude: -23.2178,
        longitude: -44.7131,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Paty do Alferes", 
        coords: [-22.4289, -43.4186], 
        decibeis: 54, 
        densidade: 94.23,
        latitude: -22.4289,
        longitude: -43.4186,
        poluicao_sonora_prevista: 54,
        frota_veiculos: 15000
    },
    { 
        nome: "Petrópolis", 
        coords: [-22.5050, -43.1789], 
        decibeis: 60, 
        densidade: 352.5,
        latitude: -22.5050,
        longitude: -43.1789,
        poluicao_sonora_prevista: 60,
        frota_veiculos: 186058
    },
    { 
        nome: "Pinheiral", 
        coords: [-22.5136, -44.0008], 
        decibeis: 59, 
        densidade: 295.4,
        latitude: -22.5136,
        longitude: -44.0008,
        poluicao_sonora_prevista: 59,
        frota_veiculos: 15000
    },
    { 
        nome: "Piraí", 
        coords: [-22.6289, -43.8981], 
        decibeis: 52, 
        densidade: 56.04,
        latitude: -22.6289,
        longitude: -43.8981,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Porciúncula", 
        coords: [-20.9631, -42.0408], 
        decibeis: 52, 
        densidade: 59.24,
        latitude: -20.9631,
        longitude: -42.0408,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Porto Real", 
        coords: [-22.4269, -44.2958], 
        decibeis: 61, 
        densidade: 400.32,
        latitude: -22.4269,
        longitude: -44.2958,
        poluicao_sonora_prevista: 61,
        frota_veiculos: 15000
    },
    { 
        nome: "Quatis", 
        coords: [-22.4064, -44.2578], 
        decibeis: 52, 
        densidade: 48.04,
        latitude: -22.4064,
        longitude: -44.2578,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "Queimados", 
        coords: [-22.7161, -43.5553], 
        decibeis: 73, 
        densidade: 1850.76,
        latitude: -22.7161,
        longitude: -43.5553,
        poluicao_sonora_prevista: 73,
        frota_veiculos: 15000
    },
    { 
        nome: "Quissamã", 
        coords: [-22.1069, -41.4708], 
        decibeis: 51, 
        densidade: 31.12,
        latitude: -22.1069,
        longitude: -41.4708,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Resende", 
        coords: [-22.4689, -44.4469], 
        decibeis: 56, 
        densidade: 117.9,
        latitude: -22.4689,
        longitude: -44.4469,
        poluicao_sonora_prevista: 56,
        frota_veiculos: 32667
    },
    { 
        nome: "Rio Bonito", 
        coords: [-22.7086, -42.6258], 
        decibeis: 56, 
        densidade: 122.48,
        latitude: -22.7086,
        longitude: -42.6258,
        poluicao_sonora_prevista: 56,
        frota_veiculos: 15000
    },
    { 
        nome: "Rio Claro", 
        coords: [-22.7239, -44.1358], 
        decibeis: 50, 
        densidade: 20.55,
        latitude: -22.7239,
        longitude: -44.1358,
        poluicao_sonora_prevista: 50,
        frota_veiculos: 15000
    },
    { 
        nome: "Rio das Flores", 
        coords: [-22.1681, -43.5858], 
        decibeis: 50, 
        densidade: 18.7,
        latitude: -22.1681,
        longitude: -43.5858,
        poluicao_sonora_prevista: 50,
        frota_veiculos: 15000
    },
    { 
        nome: "Rio das Ostras", 
        coords: [-22.5264, -41.9450], 
        decibeis: 63, 
        densidade: 686.23,
        latitude: -22.5264,
        longitude: -41.9450,
        poluicao_sonora_prevista: 63,
        frota_veiculos: 15000
    },
    { 
        nome: "Santa Maria Madalena", 
        coords: [-21.9550, -42.0078], 
        decibeis: 51, 
        densidade: 12.62,
        latitude: -21.9550,
        longitude: -42.0078,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Santo Antônio de Pádua", 
        coords: [-21.5392, -42.1803], 
        decibeis: 53, 
        densidade: 68.46,
        latitude: -21.5392,
        longitude: -42.1803,
        poluicao_sonora_prevista: 53,
        frota_veiculos: 15000
    },
    { 
        nome: "São Fidélis", 
        coords: [-21.6461, -41.7469], 
        decibeis: 52, 
        densidade: 37.65,
        latitude: -21.6461,
        longitude: -41.7469,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "São Francisco de Itabapoana", 
        coords: [-21.4708, -41.1092], 
        decibeis: 52, 
        densidade: 40.3,
        latitude: -21.4708,
        longitude: -41.1092,
        poluicao_sonora_prevista: 52,
        frota_veiculos: 15000
    },
    { 
        nome: "São Gonçalo", 
        coords: [-22.8261, -43.0489], 
        decibeis: 79, 
        densidade: 3613.57,
        latitude: -22.8261,
        longitude: -43.0489,
        poluicao_sonora_prevista: 79,
        frota_veiculos: 363605
    },
    { 
        nome: "São João de Meriti", 
        coords: [-22.8039, -43.3722], 
        decibeis: 84, 
        densidade: 12521.64,
        latitude: -22.8039,
        longitude: -43.3722,
        poluicao_sonora_prevista: 84,
        frota_veiculos: 130650
    },
    { 
        nome: "São José de Ubá", 
        coords: [-21.3581, -41.9411], 
        decibeis: 51, 
        densidade: 28.32,
        latitude: -21.3581,
        longitude: -41.9411,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "São José do Vale do Rio Preto", 
        coords: [-22.1519, -42.9239], 
        decibeis: 54, 
        densidade: 100.28,
        latitude: -22.1519,
        longitude: -42.9239,
        poluicao_sonora_prevista: 54,
        frota_veiculos: 15000
    },
    { 
        nome: "São Pedro da Aldeia", 
        coords: [-22.8389, -42.1028], 
        decibeis: 59, 
        densidade: 312.88,
        latitude: -22.8389,
        longitude: -42.1028,
        poluicao_sonora_prevista: 59,
        frota_veiculos: 15000
    },
    { 
        nome: "São Sebastião do Alto", 
        coords: [-21.9578, -42.1358], 
        decibeis: 50, 
        densidade: 19.51,
        latitude: -21.9578,
        longitude: -42.1358,
        poluicao_sonora_prevista: 50,
        frota_veiculos: 15000
    },
    { 
        nome: "Sapucaia", 
        coords: [-21.9950, -42.9142], 
        decibeis: 51, 
        densidade: 32.79,
        latitude: -21.9950,
        longitude: -42.9142,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Saquarema", 
        coords: [-22.9200, -42.5103], 
        decibeis: 58, 
        densidade: 254.34,
        latitude: -22.9200,
        longitude: -42.5103,
        poluicao_sonora_prevista: 58,
        frota_veiculos: 31651
    },
    { 
        nome: "Seropédica", 
        coords: [-22.7439, -43.7064], 
        decibeis: 60, 
        densidade: 303.92,
        latitude: -22.7439,
        longitude: -43.7064,
        poluicao_sonora_prevista: 60,
        frota_veiculos: 15000
    },
    { 
        nome: "Silva Jardim", 
        coords: [-22.6508, -42.3911], 
        decibeis: 51, 
        densidade: 22.77,
        latitude: -22.6508,
        longitude: -42.3911,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Sumidouro", 
        coords: [-22.0508, -42.6758], 
        decibeis: 51, 
        densidade: 36.78,
        latitude: -22.0508,
        longitude: -42.6758,
        poluicao_sonora_prevista: 51,
        frota_veiculos: 15000
    },
    { 
        nome: "Tanguá", 
        coords: [-22.7303, -42.7139], 
        decibeis: 58, 
        densidade: 217.37,
        latitude: -22.7303,
        longitude: -42.7139,
        poluicao_sonora_prevista: 58,
        frota_veiculos: 15000
    },
    { 
        nome: "Teresópolis", 
        coords: [-22.4167, -42.9781], 
        decibeis: 58, 
        densidade: 213.52,
        latitude: -22.4167,
        longitude: -42.9781,
        poluicao_sonora_prevista: 58,
        frota_veiculos: 85470
    },  
    ];
    adicionarMarcadores();
    }


// Função para adicionar marcadores no mapa
function adicionarMarcadores() {
    // Limpa marcadores existentes
    marcadores.forEach(marker => map.removeLayer(marker));
    marcadores = [];
    
    locais.forEach(local => {
        const markerColor = getColorByDecibels(local.poluicao_sonora_prevista);
        
        // Cria um marcador HTML customizado
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div class="marker-container">
                    <div class="marker-tooltip">
                        ${local.nome}<br>
                        Decibéis: ${local.poluicao_sonora_prevista}dB<br>
                        Densidade: ${local.densidade} hab/km²<br>
                        Lat: ${local.latitude.toFixed(4)}<br>
                        Lon: ${local.longitude.toFixed(4)}
                    </div>
                    <div class="marker-pin" style="background-color: ${markerColor}">
                        <span class="marker-text">${local.poluicao_sonora_prevista}</span>
                    </div>
                </div>
            `,
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });
        
        const marker = L.marker(local.coords, { icon: customIcon }).addTo(map);
        
        marker.on("click", () => {
            // Remove a seleção do marcador anterior
            if (marcadorAtual) {
                marcadorAtual._icon.classList.remove('selected');
            }
            
            // Adiciona seleção ao marcador atual
            marker._icon.classList.add('selected');
            marker.localData = local; // Armazena os dados no marcador
            marcadorAtual = marker;
            
            atualizarInformacoes(local);
            
            if (window.innerWidth <= 767) {
                mostrarPainelInfo();
            }
        });
        
        marcadores.push(marker);
    });
}

// Função para obter cor baseada nos decibéis
function getColorByDecibels(decibeis) {
    if (decibeis >= 70) return "#dc3545"; // Vermelho
    if (decibeis >= 65) return "#ffc107"; // Amarelo
    return "#28a745"; // Verde
}

// Função para atualizar informações no painel
function atualizarInformacoes(local) {
    // 1. Atualiza o valor de decibéis
    spanDecibeis.textContent = local.poluicao_sonora_prevista + " dB";
    
    // 2. Atualiza a barra de progresso (cor e largura)
    updateNoiseBar(local.poluicao_sonora_prevista);
    
    // 3. Atualiza o horário
    spanAtualizacao.textContent = horarioAtual();
    
    // 4. Log dos dados completos no console para verificação
    console.log('Dados da cidade selecionada:', {
        nome: local.nome,
        latitude: local.latitude,
        longitude: local.longitude,
        densidade_demografica: local.densidade,
        poluicao_sonora_prevista: local.poluicao_sonora_prevista
    });
}

// Função para obter horário atual
function horarioAtual() {
    const agora = new Date();
    return agora.toLocaleString("pt-BR");
}

// Função para obter classe CSS baseada nos decibéis
function getDecibelClass(decibeis) {
    if (decibeis >= 70) {
        return "db-high";
    } else if (decibeis >= 65) {
        return "db-medium";
    } else {
        return "db-low";
    }
}

// Função para atualizar a barra de ruído
function updateNoiseBar(decibeis) {
    const minDB = 45;
    const maxDB = 90;
    let percentage = Math.max(0, Math.min(100, ((decibeis - minDB) / (maxDB - minDB)) * 100));
    
    noiseBar.className = '';
    noiseBar.classList.add(getDecibelClass(decibeis));
    noiseBar.style.width = percentage + '%';
}

// Lógica do Tema
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    map.invalidateSize();
}

// Carregar tema salvo
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ Modo Claro';
    } else {
        themeToggle.textContent = '🌙 Modo Escuro';
    }
}

// Funções para responsividade mobile
function mostrarPainelMapa() {
    mapContainer.style.display = 'block';
    infoPanel.style.display = 'none';
    mobileMapBtn.classList.add('active');
    mobileInfoBtn.classList.remove('active');
}

function mostrarPainelInfo() {
    mapContainer.style.display = 'none';
    infoPanel.style.display = 'block';
    mobileInfoBtn.classList.add('active');
    mobileMapBtn.classList.remove('active');
}

// Configuração inicial para responsividade
function setupResponsiveLayout() {
    if (window.innerWidth <= 767) {
        mobileMenu.style.display = 'flex';
        mostrarPainelMapa();
    } else if (window.innerWidth <= 1024) {
        mobileMenu.style.display = 'none';
        mapContainer.style.display = 'block';
        infoPanel.style.display = 'block';
        mapContainer.style.height = '60vh';
    } else {
        mobileMenu.style.display = 'none';
        mapContainer.style.display = 'block';
        infoPanel.style.display = 'block';
        mapContainer.style.height = '100%';
    }
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
mobileMapBtn.addEventListener('click', mostrarPainelMapa);
mobileInfoBtn.addEventListener('click', mostrarPainelInfo);

// Ajusta o layout quando a janela é redimensionada
window.addEventListener('resize', setupResponsiveLayout);

// Fecha o painel de informações ao clicar no mapa (apenas mobile)
map.on('click', function(e) {
    if (window.innerWidth <= 767 && marcadorAtual && !e.originalEvent.target.closest('.custom-marker')) {
        marcadorAtual._icon.classList.remove('selected');
        marcadorAtual = null;
        mostrarPainelMapa();
    }
});

// Inicialização da aplicação
window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    carregarDados();
    setupResponsiveLayout();
});