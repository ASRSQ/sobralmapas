<!-- resources/views/components/selection-box.blade.php -->
<div id="selection-box" style="display: none">
    <div id="selection-area">
        <div id="drag-handle">
            <!-- Conteúdo adicional se necessário -->
            <span>Selecione a Área de Impressão</span>
            <button class="btn" id="selection-button" data-bs-toggle="tooltip" title="Opções de impressão"><i class="fas fa-bars"></i></button>
        </div>
    </div>
    

    <div class="selection-tools" style="display: none">
        <div class="print-options">
            <div>
                <label for="format">Formato:</label>
                <select id="format" class="form-control">
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                    <option value="pdf">PDF</option>
                </select>
            </div>

            <div class="scale-box">
                <label for="scale">Escala:</label>
                <div class="input-group">
                    <span class="input-group-text">1 :</span>
                    <input type="number" class="form-control" id="scale" value="8634">
                </div>
            </div>

            <p>A imagem mostrará a camada Padrão em <span id="resolution"></span></p>

            <button id="download-button" class="btn btn-primary">Baixar</button>
        </div>
    </div>
</div>
