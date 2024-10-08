<!DOCTYPE html>
<html>
<head>
    <title>Sobral em Mapas - Mapa com OpenLayers e GeoServer</title>
    <!-- Incluir os arquivos do OpenLayers -->
    <link rel="stylesheet" href="https://openlayers.org/en/v6.13.0/css/ol.css" type="text/css">
    <script src="https://openlayers.org/en/v6.13.0/build/ol.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://5737-177-200-92-79.ngrok-free.app/css/home.css">

    <link href="{{ asset('css/chat.css') }}" rel="stylesheet">
    <meta http-equiv="Content-Security-Policy">
    <link rel="stylesheet" href="{{ asset('css/home.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">






</head>

<body>
    <header>
        <div class="header-left">
            <img src="{{ asset('img/Logo_Sobral.png') }}" alt="Logo Sobral">
        </div>

        <div class="header-center">
            <h2>Sobral em Mapas</h2>
        </div>
        
        <div class="header-right">
            <nav>
                <button><i class="fas fa-book"></i>  TUTORIAL</button>
                <button><i class="fas fa-info-circle"></i>  SOBRE</button>
                <button><i class="fas fa-envelope"></i> CONTATO</button>
            </nav>
        </div>
    </header>

    <div class="container-fluid">
        <div class="row">
            <!-- Div para a caixa de seleção -->
            <div class="col-md-3">
            <div class="search-container">
        <button type="button" class="search-button"><i class="fas fa-search"></i></button>
        <input type="text" id="searchInput" placeholder="Pesquisar por mapas...">
    </div>
    <h3>Selecione um mapa para ter visualização:</h3>
    <div id="layerCheckboxList">
        @foreach($categories as $category)
        <details class="category">
            <summary>{{ $category->name }}</summary>
            @foreach($subcategories as $subcategory)
            @if($subcategory->category_id == $category->id)
            <details class="subcategory">
                <summary>{{ $subcategory->name }}</summary>
                @foreach($layers as $layer)
                @if($layer->subcategory_id == $subcategory->id)
                <div class="layer-category">
                    <input type="checkbox" id="{{ $layer->layer }}" name="{{ $layer->name }}">
                    <label for="{{ $layer->layer }}">{{ $layer->name }}</label>
                </div>
                @endif
                @endforeach
            </details>
            @endif
            @endforeach
        </details>
        @endforeach

        <div id="collapseDragDropMaps" class="drag-drop-body p-0 collapse show" style="">
            <div class="drag-drop-list">
                <!-- Outros mapas ativos existentes -->
                <!-- Dropdown para o mapa personalizado -->
                <div class="dropdown">
                    
                    <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        Mapas Ativos
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="customMapDropdown">
                        <!-- Camadas selecionadas serão adicionadas aqui dinamicamente -->
                    </ul>
                </div>
            </div>
        </div>
        </div>
        
    </div>
            <!-- Div para o mapa -->
            <div class="col-md-9">
                <div id="map" class="map"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="legend" class="card">
        <div id="legend_heading" class="card-header p-0">
            <button class="btn d-flex justify-content-between collapse-legend" data-bs-toggle="collapse" data-bs-target="#legend_body" aria-expanded="true">
                <h4>
                    <i class="fas fa-circle"></i>
                    Legenda - SobralMapas
                </h4> 
                <span class="fas fa-caret-down"></span>
            </button>
        </div>
        <div id="legend_body" class="collapse">
                <!-- Conteúdo da legenda alocado dinamicamente -->
        </div>
    </div>

    
   <!-- Botão para mostrar o chat -->
   <button id="show-chat-button"><i class="fas fa-comment"></i>  Chat - SobralMapas </button>

    <!-- Contêiner do chat -->
    <div id="chat-container">
        <div class="chat-header">
            <div class="chat-title">
                <i class="fas fa-comment"></i>
                Chat - SobralMapas
            </div>
            <button id="toggle-chat-button">
                <i class="fas fa-times" id="toggle-icon"></i>
            </button>
        </div>
        <!-- Área onde as mensagens aparecerão -->
        <div id="messages">
            <!-- Mensagem de boas-vindas -->
            <div class="welcome-message">
                <p><strong>Bem-vindo ao SobralMapas!</strong></p>
                <p>Resolva as suas dúvidas.</p>
            </div>
            <hr>
            <div class="message received"></div>
        </div>
        <!-- Caixa de input e botão de envio -->
        <div id="message-input-container">
            <input type="text" id="message-input" placeholder="Digite sua mensagem...">
            <button id="send-button">Enviar</button>
        </div>
    </div>

    <script type="text/javascript">
        var layersData = @json($layers);
    </script>
    <script>
        var baseUrl = "{{ url('/') }}";
    </script>

    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script type="module" src="{{ asset('js/home.js') }}"></script>
    
</body>
</html>


