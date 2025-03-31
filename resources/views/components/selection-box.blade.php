<!-- resources/views/components/selection-box.blade.php -->

<style>
    #selection-box {
        position: absolute;
        left: calc(50% - 150px);
        top: calc(50% - 150px);
        z-index: 1000;
        gap: 5px;
        pointer-events: auto;
        display: none;
        border-radius: 5px;
        overflow: hidden;
    }

    #selection-box.active {
        display: flex;
    }

    #selection-area {
        min-width: 350px;
        min-height: 300px;
        border: 2px dashed var(--primary-dark-color, #0086de);
        resize: both;
        overflow: hidden;
        position: relative;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 0 0 5px 5px;
        transition: background-color 0.2s;
    }

    #selection-area:hover {
        background-color: rgba(255, 255, 255, 0.15);
    }

    #drag-handle {
        background-color: var(--primary-color, #0086de);
        color: var(--text-white-color, #fff);
        padding: 8px 10px;
        font-size: 16px;
        font-weight: bold;
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 5px 5px 0 0;
    }

    #selection-button {
        all: unset;
        cursor: pointer;
        color: #fff;
        padding: 6px; 
        font-size: 16px;
        font-weight: bold;
        transition: transform 0.2s;
        border-radius: 5px;
    }

    #selection-button:hover {
        transform: scale(1.1);
    }

        
    .selection-tools {
        width: 240px;
        height: 300px;
        background-color: #fff;
        border: 1px solid var(--primary-dark-color, #0086de);
        padding: 16px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-family: 'Segoe UI', sans-serif;
        font-size: 16px;
        display: none;
    }

    .selection-tools.active {
        display: block;
    }

    .selection-tools label {
        font-weight: 600;
        margin-bottom: 6px;
        display: block;
    }

    .selection-tools select {
        width: 100%;
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
        appearance: none;
        background: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20fill%3D%22%23333%22%20height%3D%2210%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2210%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22/%3E%3C/svg%3E") no-repeat right 10px center;
        background-color: #fff;
        background-size: 12px;
        margin-bottom: 12px;
        cursor: pointer;
    }

    .selection-tools .scale-box {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 12px;
    }

    .selection-tools .scale-box span {
        font-weight: bold;
        padding: 6px 10px;
        background-color: #f1f1f1;
        border: 1px solid #ccc;
        border-radius: 6px;
    }

    .selection-tools input[type="number"] {
        flex: 1;
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
    }

    .selection-tools p {
        font-size: 13px;
        margin-bottom: 40px;
        color: #555;
    }

    .selection-tools .btn {
        display: block;
        width: 50%;
        background-color: var(--primary-dark-color, #0086de);
        color: white;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        transition: background-color 0.2s ease;
        text-align: center;
    }

    .selection-tools .btn:hover {
        background-color: #006bb5;
    }

    </style>
    
    <div id="selection-box">
        <div id="selection-area">
            <div id="drag-handle">
                <span>Selecione a Área de Impressão</span>
                <button class="btn" id="selection-button" title="Opções"><i class="fas fa-bars"></i></button>
            </div>
        </div>
    
        <div class="selection-tools">
            <div class="print-options">
                <div>
                    <label for="format">Formato:</label>
                    <select id="format" class="form-control">
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="pdf">PDF</option>
                    </select>
                </div>
    
                <div class="scale-box mt-2">
                    <label for="scale">Escala:</label>
                    <div class="input-group">
                        <span class="input-group-text">1 :</span>
                        <input type="number" class="form-control" id="scale" value="8634">
                    </div>
                </div>
    
                <p class="mt-2">A imagem mostrará a camada padrão em <span id="resolution"></span></p>
                <button id="download-button" class="btn btn-primary mt-2">Baixar</button>
            </div>
        </div>
    </div>
    
    <script>
    document.addEventListener("DOMContentLoaded", function () {
        const selectionBox = document.getElementById("selection-box");
        const selectionArea = document.getElementById("selection-area");
        const dragHandle = document.getElementById("drag-handle");
        const selectionButton = document.getElementById("selection-button");
        const selectionTools = document.querySelector(".selection-tools");
        const resolution = document.getElementById("resolution");
        const downloadButton = document.getElementById("download-button");
        const scaleInput = document.getElementById("scale");
        const btnImprimir = document.getElementById("btn-imprimir");
        
    
        let isDragging = false;
        let startX, startY, offsetX, offsetY;
    
        // Mostrar a caixa de seleção ao clicar no botão imprimir
        btnImprimir.addEventListener("click", () => {
            selectionBox.classList.add("active"); 
            selectionBox.classList.remove("active"); 
            updateDimensions();

        });
    
        // Mover a caixa de seleção
        dragHandle.addEventListener("mousedown", function (e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            offsetX = selectionBox.offsetLeft;
            offsetY = selectionBox.offsetTop;
            e.preventDefault();
        });
    
        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                selectionBox.style.left = `${offsetX + (e.clientX - startX)}px`;
                selectionBox.style.top = `${offsetY + (e.clientY - startY)}px`;

            }
        });
    
        document.addEventListener("mouseup", function () {
            isDragging = false;
        });
    
        // Atualiza resolução (largura x altura)
        function updateDimensions() {
            resolution.innerText = `${selectionArea.offsetWidth} x ${selectionArea.offsetHeight}`;
        }
    
        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
        });
        resizeObserver.observe(selectionArea);
    
        // Alternar menu de ferramentas
        selectionButton.addEventListener("click", () => {
            selectionTools.classList.toggle("active"); 
        });
        
    
        // Download da seleção
        downloadButton.addEventListener("click", async () => {
            const mapElement = document.getElementById("map");
            const scale = parseFloat(scaleInput.value) || 8000;

            if (!mapElement || !selectionArea) {
                console.error("Erro: Elementos do mapa ou seleção não encontrados!");
                return;
            }

            if (typeof map !== "undefined" && map) {
                map.updateSize();
                map.renderSync();
            }

            const canvasMap = await html2canvas(mapElement, { useCORS: true, scale: 3 });
            const selectionRect = selectionArea.getBoundingClientRect();
            const mapRect = mapElement.getBoundingClientRect();

            const scaleFactor = scale / 8000;
            const cropX = (selectionRect.left - mapRect.left) * 3 * scaleFactor;
            const cropY = (selectionRect.top - mapRect.top) * 3 * scaleFactor;
            const cropWidth = selectionRect.width * 3 * scaleFactor;
            const cropHeight = selectionRect.height * 3 * scaleFactor;

            const cropCanvas = document.createElement("canvas");
            cropCanvas.width = cropWidth;
            cropCanvas.height = cropHeight;
            const ctx = cropCanvas.getContext("2d");
            ctx.drawImage(canvasMap, cropX, cropY, cropWidth, cropHeight, 0, 0, cropCanvas.width, cropCanvas.height);

            const padding = 20;
            const titleHeight = 50;

            const finalCanvas = document.createElement("canvas");
            finalCanvas.width = cropWidth + padding * 2;
            finalCanvas.height = cropHeight + padding * 2 + titleHeight + 10;

            const finalCtx = finalCanvas.getContext("2d");

            // Fundo branco
            finalCtx.fillStyle = "#ffffff";
            finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

            // Topbar azul com título branco
            finalCtx.fillStyle = "#0086de";
            finalCtx.fillRect(0, 0, finalCanvas.width, titleHeight);
            finalCtx.fillStyle = "#ffffff";
            finalCtx.font = "bold 18px Arial";
            finalCtx.textAlign = "center";
            finalCtx.fillText("Mapa de Sobral - Área Selecionada", finalCanvas.width / 2, 32);

            // Mapa
            finalCtx.drawImage(cropCanvas, padding, titleHeight + padding);

            // Borda do mapa
            finalCtx.strokeStyle = "#0086de";
            finalCtx.lineWidth = 3;
            finalCtx.strokeRect(padding - 2, titleHeight + padding - 2, cropWidth + 4, cropHeight + 4);

            // Data no canto inferior esquerdo
            const data = new Date().toLocaleDateString("pt-BR");
            finalCtx.fillStyle = "#333";
            finalCtx.font = "14px Arial";
            finalCtx.textAlign = "left";
            finalCtx.fillText(`📅 Data: ${data}`, padding, titleHeight + padding + cropHeight + 20);

            // Legenda sobreposta ao mapa
            const legendWidth = 160;
            const legendHeight = 100;
            const legendX = finalCanvas.width - padding - legendWidth - 5;
            const legendY = titleHeight + padding + cropHeight - legendHeight - 5;

            finalCtx.fillStyle = "rgba(255, 255, 255, 0.95)";
            finalCtx.strokeStyle = "#0086de";
            finalCtx.lineWidth = 1;
            finalCtx.beginPath();
            finalCtx.roundRect ? finalCtx.roundRect(legendX, legendY, legendWidth, legendHeight, 10) :
            finalCtx.rect(legendX, legendY, legendWidth, legendHeight);
            finalCtx.fill();
            finalCtx.stroke();

            // Escala
            finalCtx.fillStyle = "#333";
            finalCtx.font = "bold 13px Arial";
            finalCtx.fillText(`Escala 1:${scale}`, legendX + 12, legendY + 22);

            // Rosa dos Ventos
            const centerX = legendX + 20;
            const centerY = legendY + 55;

            finalCtx.strokeStyle = "#0086de";
            finalCtx.beginPath();
            finalCtx.moveTo(centerX, centerY - 10);
            finalCtx.lineTo(centerX, centerY + 10);
            finalCtx.moveTo(centerX - 10, centerY);
            finalCtx.lineTo(centerX + 10, centerY);
            finalCtx.stroke();

            finalCtx.fillStyle = "#000";
            finalCtx.font = "10px Arial";
            finalCtx.fillText("N", centerX - 4, centerY - 12);
            finalCtx.fillText("S", centerX - 4, centerY + 20);
            finalCtx.fillText("L", centerX - 16, centerY + 4);
            finalCtx.fillText("O", centerX + 10, centerY + 4);

            // Fonte
            finalCtx.fillStyle = "#666";
            finalCtx.font = "11px Arial";
            finalCtx.fillText("Fonte: GeoServer Sobral", legendX + 12, legendY + legendHeight - 10);

            // Exportar
            const format = document.getElementById("format").value;

            if (format === "pdf") {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF("landscape", "mm", "a4");

                const imgData = finalCanvas.toDataURL("image/png");
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                const imgWidth = finalCanvas.width;
                const imgHeight = finalCanvas.height;

                const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                const newWidth = imgWidth * ratio;
                const newHeight = imgHeight * ratio;

                const xOffset = (pageWidth - newWidth) / 2;
                const yOffset = (pageHeight - newHeight) / 2;

                pdf.addImage(imgData, "PNG", xOffset, yOffset, newWidth, newHeight);
                pdf.save("Mapa_de_Sobral.pdf");

            } else {
                const imageURL = finalCanvas.toDataURL(`image/${format}`);
                const link = document.createElement("a");
                link.href = imageURL;
                link.download = `Mapa_de_Sobral.${format}`;
                link.click();
            }
        });


    });

</script>
    