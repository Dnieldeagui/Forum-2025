from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import json

app = Flask(__name__)
CORS(app)  # Permite requisições do frontend

# =============================
# Dataset real — usado para TREINAR o modelo
# =============================
data_real = {
    'Cidade': ['Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza',
               'Brasília', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus',
               'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís',
               'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Nova Iguaçu', 'Teresina',
               'Campo Grande', 'São Bernardo', 'João Pessoa', 'Santo André', 'Osasco'],
    'Densidade_demografica': [
        5265, 7167, 3859, 7786,
        444, 4027, 7037, 2837, 158,
        1315, 1776, 13494, 1359, 1215,
        3613, 1854, 1729, 1510, 584,
        97, 2817, 3421, 17454, 11229
    ],
    'Poluicao_sonora': [
        78, 75, 68, 72,
        55, 65, 76, 62, 45,
        58, 60, 88, 63, 56,
        74, 61, 71, 69, 52,
        48, 64, 67, 89, 82
    ],
    'Frota_veiculos': [
        3134989.0, 2696745.0, 1036885.0, 1239191.0,
        2083081.0, 1737730.0, 736969.0, 912157.0,
        898617.0, 533014.0, 1329583.0, 2000000.0,  
        1000403.0, 469262.0, 800000.0, 408561.0,   
        600000.0, 700000.0, 569296.0, 685645.0,    
        648424.0, 456413.0, 900000.0, 850000.0     
    ]
}

df_real = pd.DataFrame(data_real)

# =============================
# Dicionário de coordenadas para cidades do RJ
# =============================
coordenadas_cidades_rj = {
    'Rio de Janeiro': [-22.9068, -43.1729],
    'Angra dos Reis': [-23.0067, -44.3181],
    'Aperibé': [-21.6253, -42.1028],
    'Araruama': [-22.8728, -42.3428],
    'Areal': [-22.2286, -43.1058],
    'Armação dos Búzios': [-22.7472, -41.8814],
    'Arraial do Cabo': [-22.9661, -42.0278],
    'Barra do Piraí': [-22.4711, -43.8256],
    'Barra Mansa': [-22.5439, -44.1708],
    'Belford Roxo': [-22.7639, -43.3991],
    'Bom Jardim': [-22.1550, -42.4250],
    'Bom Jesus do Itabapoana': [-21.1353, -41.6794],
    'Cabo Frio': [-22.8784, -42.0196],
    'Cachoeiras de Macacu': [-22.4658, -42.6522],
    'Cambuci': [-21.5753, -41.9111],
    'Campos dos Goytacazes': [-21.7523, -41.3304],
    'Cantagalo': [-21.9803, -42.3683],
    'Carapebus': [-22.1872, -41.6631],
    'Cardoso Moreira': [-21.4872, -41.6164],
    'Carmo': [-21.9358, -42.6086],
    'Casimiro de Abreu': [-22.4811, -42.2044],
    'Comendador Levy Gasparian': [-22.0286, -43.2086],
    'Conceição de Macabu': [-22.0853, -41.8681],
    'Cordeiro': [-22.0286, -42.3619],
    'Duas Barras': [-22.0533, -42.5239],
    'Duque de Caxias': [-22.7854, -43.3047],
    'Engenheiro Paulo de Frontin': [-22.5486, -43.6764],
    'Guapimirim': [-22.5372, -42.9819],
    'Iguaba Grande': [-22.8389, -42.2289],
    'Itaboraí': [-22.7475, -42.8591],
    'Itaguaí': [-22.8522, -43.7753],
    'Italva': [-21.4236, -41.6914],
    'Itaocara': [-21.6722, -42.0761],
    'Itaperuna': [-21.2053, -41.8878],
    'Itatiaia': [-22.4917, -44.5633],
    'Japeri': [-22.6436, -43.6531],
    'Laje do Muriaé': [-21.2072, -42.1272],
    'Macaé': [-22.3700, -41.7869],
    'Macuco': [-21.9842, -42.2533],
    'Magé': [-22.6528, -43.0406],
    'Mangaratiba': [-22.9594, -44.0406],
    'Maricá': [-22.9194, -42.8186],
    'Mendes': [-22.5267, -43.7328],
    'Mesquita': [-22.7828, -43.4289],
    'Miguel Pereira': [-22.4539, -43.4689],
    'Miracema': [-21.4122, -42.1967],
    'Natividade': [-21.0422, -41.9733],
    'Nilópolis': [-22.8056, -43.4133],
    'Niterói': [-22.8834, -43.1034],
    'Nova Friburgo': [-22.2819, -42.5311],
    'Nova Iguaçu': [-22.7556, -43.4603],
    'Paracambi': [-22.6089, -43.7108],
    'Paraíba do Sul': [-22.1589, -43.2931],
    'Paraty': [-23.2178, -44.7131],
    'Paty do Alferes': [-22.4289, -43.4186],
    'Petrópolis': [-22.5050, -43.1789],
    'Pinheiral': [-22.5136, -44.0008],
    'Piraí': [-22.6289, -43.8981],
    'Porciúncula': [-20.9631, -42.0408],
    'Porto Real': [-22.4269, -44.2958],
    'Quatis': [-22.4064, -44.2578],
    'Queimados': [-22.7161, -43.5553],
    'Quissamã': [-22.1069, -41.4708],
    'Resende': [-22.4689, -44.4469],
    'Rio Bonito': [-22.7086, -42.6258],
    'Rio Claro': [-22.7239, -44.1358],
    'Rio das Flores': [-22.1681, -43.5858],
    'Rio das Ostras': [-22.5264, -41.9450],
    'Santa Maria Madalena': [-21.9550, -42.0078],
    'Santo Antônio de Pádua': [-21.5392, -42.1803],
    'São Fidélis': [-21.6461, -41.7469],
    'São Francisco de Itabapoana': [-21.4708, -41.1092],
    'São Gonçalo': [-22.8261, -43.0489],
    'São João de Meriti': [-22.8039, -43.3722],
    'São José de Ubá': [-21.3581, -41.9411],
    'São José do Vale do Rio Preto': [-22.1519, -42.9239],
    'São Pedro da Aldeia': [-22.8389, -42.1028],
    'São Sebastião do Alto': [-21.9578, -42.1358],
    'Sapucaia': [-21.9950, -42.9142],
    'Saquarema': [-22.9200, -42.5103],
    'Seropédica': [-22.7439, -43.7064],
    'Silva Jardim': [-22.6508, -42.3911],
    'Sumidouro': [-22.0508, -42.6758],
    'Tanguá': [-22.7303, -42.7139],
    'Teresópolis': [-22.4167, -42.9781],
    'Trajano de Moraes': [-22.0633, -42.0664],
    'Três Rios': [-22.1167, -43.2083],
    'Valença': [-22.2456, -43.7003],
    'Varre-Sai': [-20.9278, -41.8700],
    'Vassouras': [-22.4058, -43.6625],
    'Volta Redonda': [-22.5250, -44.1043]
}

# =============================
# Dados das cidades do RJ (para predição)
# =============================
dados_rj = {
    'cidade': [  
        'Angra dos Reis', 'Aperibé', 'Araruama', 'Areal', 'Armação dos Búzios',
        'Arraial do Cabo', 'Barra do Piraí', 'Barra Mansa', 'Belford Roxo',
        'Bom Jardim', 'Bom Jesus do Itabapoana', 'Cabo Frio', 'Cachoeiras de Macacu',
        'Cambuci', 'Campos dos Goytacazes', 'Cantagalo', 'Carapebus', 'Cardoso Moreira', 'Carmo',
        'Casimiro de Abreu', 'Comendador Levy Gasparian', 'Conceição de Macabu', 'Cordeiro',
        'Duas Barras', 'Duque de Caxias', 'Engenheiro Paulo de Frontin', 'Guapimirim',
        'Iguaba Grande', 'Itaboraí', 'Itaguaí', 'Italva', 'Itaocara', 'Itaperuna', 'Itatiaia',
        'Japeri', 'Laje do Muriaé', 'Macaé', 'Macuco', 'Magé', 'Mangaratiba', 'Maricá', 'Mendes',
        'Mesquita', 'Miguel Pereira', 'Miracema', 'Natividade', 'Nilópolis', 'Niterói', 'Nova Friburgo',
        'Nova Iguaçu', 'Paracambi', 'Paraíba do Sul', 'Paraty', 'Paty do Alferes', 'Petrópolis', 'Pinheiral',
        'Piraí', 'Porciúncula', 'Porto Real', 'Quatis', 'Queimados', 'Quissamã', 'Resende', 'Rio Bonito',
        'Rio Claro', 'Rio das Flores', 'Rio das Ostras', 'Rio de Janeiro', 'Santa Maria Madalena',
        'Santo Antônio de Pádua', 'São Fidélis', 'São Francisco de Itabapoana', 'São Gonçalo',
        'São João de Meriti', 'São José de Ubá', 'São José do Vale do Rio Preto', 'São Pedro da Aldeia',
        'São Sebastião do Alto', 'Sapucaia', 'Saquarema', 'Seropédica', 'Silva Jardim', 'Sumidouro',
        'Tanguá', 'Teresópolis', 'Trajano de Moraes', 'Três Rios', 'Valença', 'Varre-Sai', 'Vassouras',
        'Volta Redonda'
    ],
    'densidade_demografica': [ 
        205.84, 116.71, 203.16, 106.82, 563.65, 203.71, 158.88, 310.52, 6116.19, 73.48, 58.95,
        537.34, 59.64, 26.18, 119.91, 25.95, 45.42, 24.8, 56.25, 99.61, 80.46, 62.39, 183.84, 28.92, 1729.36,
        87.83, 144.22, 547.7, 521.6, 413.44, 48.33, 52.91, 91.3, 128.23, 1178.61, 28.94, 202.46, 69.1,
        583.78, 112.13, 545.61, 483.61, 4059.54, 92.32, 88.64, 38.94, 7568.4, 3601.67, 203.05, 1509.6, 216.68,
        73.65, 48.95, 94.23, 352.5, 295.4, 56.04, 59.24, 400.32, 48.04, 1850.76, 31.12, 117.9, 122.48, 20.55, 18.7,
        686.23, 5174.6, 12.62, 68.46, 37.65, 40.3, 3613.57, 80.84, 12521.64, 28.32, 100.28, 312.88, 19.51,
        32.79, 254.34, 303.92, 22.77, 36.78, 217.37, 213.52, 17.43, 242.68, 52.34, 50.55, 63.38, 1436.33
    ],
    'frota_veiculos': [
        54451.0, 15000.0, 57140.0, 15000.0, 15000.0, 15000.0, 32797.0, 68027.0, 97316.0, 15000.0, 15000.0,
        95545.0, 15000.0, 15000.0, 248200.0, 15000.0, 15000.0, 15000.0, 15000.0, 15000.0, 15000.0, 15000.0, 15000.0, 15000.0, 330367.0, 
        15000.0, 15000.0, 15000.0, 75956.0, 46330.0, 15000.0, 15000.0, 41097.0, 15000.0, 15000.0, 15000.0, 108329.0, 15000.0, 61928.0, 
        15000.0, 53714.0, 15000.0, 41008.0, 15000.0, 15000.0, 15000.0, 50307.0, 290045.0, 111215.0, 307092.0, 15000.0, 15000.0, 15000.0, 
        15000.0, 186058.0, 15000.0, 15000.0, 15000.0, 15000.0, 15000.0, 32667.0, 15000.0, 63271.0, 15000.0, 15000.0, 15000.0, 15000.0, 49489.0, 
        3134989.0, 15000.0, 15000.0, 15000.0, 15000.0, 363605.0, 130650.0, 15000.0, 15000.0, 15000.0, 15000.0, 15000.0, 31651.0, 15000.0, 15000.0, 
        15000.0, 15000.0, 85470.0, 15000.0, 31506.0, 22346.0, 15000.0, 15000.0, 127778.0 
    ]
}

df_rj = pd.DataFrame(dados_rj)

# =============================
# Treinar o modelo
# =============================
X = df_real[['Frota_veiculos', 'Densidade_demografica']]
y = df_real['Poluicao_sonora']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestRegressor(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# =============================
# Rota para obter dados de TODAS as cidades do RJ
# =============================
@app.route('/api/dados', methods=['GET'])
def get_dados():
    locais = []
    
    # Para cada cidade do RJ, criar um ponto no mapa
    for cidade in dados_rj['cidade']:
        if cidade in coordenadas_cidades_rj:
            # Encontrar índice da cidade nos dados
            index = dados_rj['cidade'].index(cidade)
            densidade = dados_rj['densidade_demografica'][index]
            frota = dados_rj['frota_veiculos'][index]
            
            # Prever poluição sonora usando o modelo treinado
            poluicao_prevista = rf.predict([[frota, densidade]])[0]
            
            local = {
                'nome': cidade,
                'coords': coordenadas_cidades_rj[cidade],
                'decibeis': round(poluicao_prevista, 1),
                'densidade': densidade,
                'frota_veiculos': frota,
                'latitude': coordenadas_cidades_rj[cidade][0],
                'longitude': coordenadas_cidades_rj[cidade][1],
                'poluicao_sonora_prevista': round(poluicao_prevista, 1)
            }
            locais.append(local)
    
    print(f"Total de cidades do RJ carregadas: {len(locais)}")
    return jsonify({'locais': locais})

# =============================
# Rota para prever poluição sonora de uma cidade específica
# =============================
@app.route('/api/prever', methods=['POST'])
def prever_poluicao():
    data = request.json
    cidade = data.get('cidade')
    
    if cidade in dados_rj['cidade']:
        index = dados_rj['cidade'].index(cidade)
        densidade = dados_rj['densidade_demografica'][index]
        frota = dados_rj['frota_veiculos'][index]
        
        poluicao_prevista = rf.predict([[frota, densidade]])[0]
        
        return jsonify({
            'cidade': cidade,
            'latitude': coordenadas_cidades_rj[cidade][0],
            'longitude': coordenadas_cidades_rj[cidade][1],
            'densidade_demografica': densidade,
            'frota_veiculos': frota,
            'poluicao_sonora_prevista': round(poluicao_prevista, 1)
        })
    else:
        return jsonify({'erro': 'Cidade não encontrada'}), 404

# =============================
# Rota para obter informações do modelo
# =============================
@app.route('/api/info', methods=['GET'])
def get_info():
    y_pred = rf.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    return jsonify({
        'modelo': 'Random Forest Regressor',
        'r2_score': round(r2, 3),
        'mean_absolute_error': round(mae, 3),
        'cidades_treinamento': len(df_real),
        'cidades_rj': len(dados_rj['cidade'])
    })

if __name__ == '__main__':
    app.run(debug=True, port=8000)