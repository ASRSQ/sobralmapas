@extends('layouts.app')

@section('title', 'Sobral em Mapas')

@section('content')

<x-selection-box />
<div id="map"></div>

{{-- Componente de ferramenta de medição --}}
<x-ferramenta-medicao/>

<!-- Componente do chat -->
<x-chat/>

@endsection
