// Função para inicializar a caixa de seleção (mover e redimensionar)
function initializeSelectionBox() {
    const selectionBox = document.getElementById("selection-box");
    const selectionArea = document.getElementById("selection-area");
    const dragHandle = document.getElementById("drag-handle");
    const selectionButton = document.getElementById("selection-button");
    const selectionTools = document.querySelector(".selection-tools");
    const resolution = document.getElementById("resolution");
    const downloadButton = document.getElementById("download-button");
    const scaleInput = document.getElementById("scale");

    let isDragging = false;
    let isResizing = false;
    let startX, startY, startWidth, startHeight, offsetX, offsetY;

    // ✅ Criar um "handle" para permitir redimensionamento no canto inferior direito
    const resizeHandle = document.createElement("div");
    resizeHandle.style.width = "15px";
    resizeHandle.style.height = "15px";
    resizeHandle.style.background = "#000";
    resizeHandle.style.position = "absolute";
    resizeHandle.style.right = "0";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.cursor = "nwse-resize";
    selectionBox.appendChild(resizeHandle);

    // ✅ Permitir arrastar a caixa pelo título azul
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

        if (isResizing) {
            let newWidth = startWidth + (e.clientX - startX);
            let newHeight = startHeight + (e.clientY - startY);

            // 🔥 Garante que o tamanho mínimo seja de 50x50px
            if (newWidth >= 50 && newHeight >= 50) {
                selectionArea.style.width = `${newWidth}px`;
                selectionArea.style.height = `${newHeight}px`;
                updateDimensions();
            }
        }
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
        isResizing = false;
    });

    // ✅ Permitir redimensionar a caixa de seleção corretamente
    resizeHandle.addEventListener("mousedown", function (e) {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = selectionArea.offsetWidth;
        startHeight = selectionArea.offsetHeight;
        e.preventDefault();
    });

    // ✅ Atualizar dimensões na interface
    function updateDimensions() {
        resolution.innerHTML = `${selectionArea.offsetWidth} x ${selectionArea.offsetHeight}`;
    }

    updateDimensions();

    // ✅ Corrigir o evento de clique para abrir o menu de impressão
    if (selectionButton && selectionTools) {
        selectionButton.addEventListener("click", function () {
            selectionTools.style.display = selectionTools.style.display === "none" || selectionTools.style.display === ""
                ? "block"
                : "none";
        });
    }

    // ✅ Garantir que o botão de download funcione corretamente
    if (downloadButton) {
        downloadButton.addEventListener("click", function () {
            captureSelectedArea();
        });
    }

    function captureSelectedArea() {
        const mapElement = document.getElementById("map");
        const format = document.getElementById("format").value;
        const scale = parseFloat(scaleInput.value) || 8000;

        if (!mapElement || !selectionArea) {
            console.error("Erro: Elementos do mapa ou seleção não encontrados!");
            return;
        }

        // ✅ Força a renderização do OpenLayers antes da captura
        if (typeof map !== "undefined" && map) {
            map.updateSize();
            map.renderSync();
        }

        html2canvas(mapElement, {
            useCORS: true,
            backgroundColor: null,
            scale: 3, // 🔥 Aumentando a resolução para melhor qualidade
        }).then((canvasMap) => {
            const selectionRect = selectionArea.getBoundingClientRect();
            const mapRect = mapElement.getBoundingClientRect();

            const cropCanvas = document.createElement("canvas");
            const ctx = cropCanvas.getContext("2d");

            // 🔥 Corrigindo a escala corretamente
            const scaleFactor = scale / 8000; // Ajuste de escala
            const cropX = (selectionRect.left - mapRect.left) * 3 * scaleFactor;
            const cropY = (selectionRect.top - mapRect.top) * 3 * scaleFactor;
            const cropWidth = selectionRect.width * 3 * scaleFactor;
            const cropHeight = selectionRect.height * 3 * scaleFactor;

            cropCanvas.width = cropWidth;
            cropCanvas.height = cropHeight;

            ctx.drawImage(canvasMap, cropX, cropY, cropWidth, cropHeight, 0, 0, cropCanvas.width, cropCanvas.height);

            if (format === "pdf") {
                generatePDF(cropCanvas);
            } else {
                downloadImage(cropCanvas, format);
            }
        }).catch((error) => {
            console.error("Erro ao capturar a área:", error);
        });
    }

    function downloadImage(canvas, format) {
        const imageURL = canvas.toDataURL(`image/${format}`);
        const link = document.createElement("a");
        link.href = imageURL;
        link.download = `Mapa.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generatePDF(canvas) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("landscape", "mm", "a4");

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("Mapa.pdf");
    }
}









// botao flutuante de Medir
function initializeFloatingButton() {
    const floatingButton = document.getElementById("floating-button");
    const measureButton = document.getElementById("btn-measure");
    floatingButton.style.display = "none";

    // Função para alternar a visibilidade do botão flutuante
    const toggleFloatingButtonVisibility = () => {
        floatingButton.style.display = floatingButton.style.display === "none" ? "block" : "none";
    };

    // Adicionando eventos de clique para o botão "Medir"
    measureButton.addEventListener("click", toggleFloatingButtonVisibility);
    
    // Adicionando evento de toque para dispositivos móveis
    measureButton.addEventListener("touchend", (e) => {
        e.preventDefault(); // Previne o comportamento padrão
        toggleFloatingButtonVisibility();
    });

    function dragElement(el) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        const startDrag = (e) => {
            // Previne arrastar quando é um clique em dropdown ou select
            if (e.target.closest(".dropdown-menu") || e.target.closest("select")) {
                return;
            }

            e.preventDefault(); // Previne o comportamento padrão
            pos3 = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
            pos4 = e.type === "mousedown" ? e.clientY : e.touches[0].clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            // Para touch
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        };

        const elementDrag = (e) => {
            e.preventDefault(); // Previne o comportamento padrão
            pos1 = pos3 - (e.type === "mousemove" ? e.clientX : e.touches[0].clientX);
            pos2 = pos4 - (e.type === "mousemove" ? e.clientY : e.touches[0].clientY);
            pos3 = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
            pos4 = e.type === "mousemove" ? e.clientY : e.touches[0].clientY;

            el.style.top = el.offsetTop - pos2 + "px";
            el.style.left = el.offsetLeft - pos1 + "px";
        };

        const closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        };

        // Adicionando os event listeners para mouse e toque
        el.onmousedown = startDrag;
        el.ontouchstart = startDrag; // Para dispositivos móveis
    }

    // Ativando a funcionalidade de arraste no botão flutuante
    if (floatingButton) {
        dragElement(floatingButton);
    }

}
document.querySelector(".dropdown-toggle").addEventListener("touchend", function (event) {
    event.stopPropagation();
    let dropdown = new bootstrap.Dropdown(this);
    dropdown.toggle();
});


// Card com opcoes de medição
function initializeMeasure() {
    let draw;
    let sketch;
    let helpTooltipElement;
    let measureTooltipElement;
    let measureTooltip;
    let helpTooltip;
    let selectedLineColor = "#ffcc33"; // Cor padrão da linha e bolinha
    let selectedLineWidth = 2; // Largura padrão

    // Elementos HTML
    const measureLineButton = document.getElementById("measure-line");
    const measureAreaButton = document.getElementById("measure-area");
    const lineColorPicker = document.getElementById("line-color-picker");
    const lineWidthPicker = document.getElementById("line-width-picker");
    const lineWidthValue = document.getElementById("line-width-value");
    const clearDrawingsButton = document.getElementById("clear-drawings");
    const stopDrawingButton = document.getElementById("stop-drawing");

    const source = new ol.source.Vector({
        wrapX: false,
    });

    // Camada de vetor para as geometrias
    const vectorLayer = new ol.layer.Vector({
        source: source,
        style: function (feature) {
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: selectedLineColor,
                    width: 2,
                }),
                fill: new ol.style.Fill({
                    color: hexToRGBA(selectedLineColor, 0.4), // Cor preenchida semi-transparente
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: selectedLineColor, // Cor da bolinha
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#000000",
                        width: 1,
                    }),
                }),
            });
        },
    });

    window.map.addLayer(vectorLayer);

    // Converte hexadecimal para RGBA
    function hexToRGBA(hex, alpha) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Atualiza a cor da linha e do polígono com base no seletor de cor
    function updateLineColor(color) {
        selectedLineColor = color;
        vectorLayer.setStyle(function (feature) {
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: selectedLineColor,
                    width: 2,
                }),
                fill: new ol.style.Fill({
                    color: hexToRGBA(selectedLineColor, 0.4), // Preenchimento semi-transparente
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: selectedLineColor, // Bolinha com a cor atual
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#000000",
                        width: 1,
                    }),
                }),
            });
        });
    }

    // Define o tipo de desenho (linha ou polígono)
    function setDrawType(type) {
        if (draw) {
            window.map.removeInteraction(draw);
        }

        draw = new ol.interaction.Draw({
            source: source,
            type: type,
            style: function (feature) {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: selectedLineColor,
                        width: 2,
                        lineDash: [10, 10],
                    }),
                    fill: new ol.style.Fill({
                        color: hexToRGBA(selectedLineColor, 0.4), // Preenchimento semi-transparente durante o desenho
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: selectedLineColor, // Cor da bolinha
                        }),
                        stroke: new ol.style.Stroke({
                            color: "#000000",
                            width: 1,
                        }),
                    }),
                });
            },
        });

        window.map.addInteraction(draw);
        createMeasureTooltip();
        createHelpTooltip();

        draw.on("drawstart", function (evt) {
            sketch = evt.feature;
            let tooltipCoord = evt.coordinate;

            sketch.getGeometry().on("change", function (evt) {
                const geom = evt.target;
                let output;
                if (geom instanceof ol.geom.Polygon) {
                    output = `<span>${formatArea(geom)}</span>`;
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = `<span>${formatLength(geom)}</span>`;
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        });

        draw.on("drawend", function () {
            sketch.setStyle(
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: selectedLineColor,
                        width: 2,
                        lineDash: null,
                    }),
                    fill: new ol.style.Fill({
                        color: hexToRGBA(selectedLineColor, 0.4), // Preenchimento após o desenho
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: selectedLineColor,
                        }),
                        stroke: new ol.style.Stroke({
                            color: "#000000",
                            width: 1,
                        }),
                    }),
                })
            );
            measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
            measureTooltip.setOffset([0, -7]);
            sketch = null;
            measureTooltipElement = null;
            createMeasureTooltip();
        });
    }

    // Criação dos tooltips de ajuda e medição
    function createHelpTooltip() {
        if (helpTooltipElement) {
            helpTooltipElement.remove();
        }
        helpTooltipElement = document.createElement("div");
        helpTooltipElement.className = "ol-tooltip hidden";
        helpTooltip = new ol.Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: "center-left",
        });
        window.map.addOverlay(helpTooltip);
    }

    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.remove();
        }
        measureTooltipElement = document.createElement("div");
        measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: "bottom-center",
            stopEvent: false,
            insertFirst: false,
        });
        window.map.addOverlay(measureTooltip);
    }

    // Formata área e comprimento
    function formatArea(polygon) {
        const area = ol.sphere.getArea(polygon);
        return area > 10000
            ? `${Math.round((area / 1000000) * 100) / 100} km²`
            : `${Math.round(area * 100) / 100} m²`;
    }

    function formatLength(line) {
        const length = ol.sphere.getLength(line);
        return length > 100
            ? `${Math.round((length / 1000) * 100) / 100} km`
            : `${Math.round(length * 100) / 100} m`;
    }

    // Limpa todas as geometrias desenhadas e tooltips
    function clearDrawings() {
        source.clear();
        window.map
            .getOverlays()
            .getArray()
            .slice()
            .forEach(function (overlay) {
                if (overlay.getElement().classList.contains("ol-tooltip")) {
                    window.map.removeOverlay(overlay);
                }
            });
        if (measureTooltipElement) {
            measureTooltipElement.innerHTML = "";
        }
        if (helpTooltipElement) {
            helpTooltipElement.classList.add("hidden");
        }
        createMeasureTooltip();
        createHelpTooltip();
    }

    // Eventos para definir o tipo de medição
    measureLineButton.addEventListener("click", function (event) {
        event.preventDefault();
        setDrawType("LineString");
    });

    measureAreaButton.addEventListener("click", function (event) {
        event.preventDefault();
        setDrawType("Polygon");
    });

    // Atualiza a cor conforme a escolha do usuário
    lineColorPicker.addEventListener("input", function () {
        updateLineColor(this.value);
    });

    clearDrawingsButton.addEventListener("click", function () {
        clearDrawings();
    });

    // Adiciona um evento para o botão que para o desenho
    stopDrawingButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (draw) {
            window.map.removeInteraction(draw);
            draw = null; // Limpa a variável draw para que não haja referências pendentes
        }
    });
}

// Componente de chat
function initializeChat() {
    const showChatButton = document.getElementById("show-chat-button");
    const chatContainer = document.getElementById("chat-container");
    const toggleChatButton = document.getElementById("toggle-chat-button");
    const sendButton = document.getElementById("send-button");
    const messageInput = document.getElementById("message-input");
    const messagesContainer = document.getElementById("messages");

    showChatButton.addEventListener("click", () => {
        if (window.innerWidth > 800) {
          // Desktop
          chatContainer.style.display = "flex";
        } else {
          // Mobile
          chatContainer.classList.add("open");
        }
        showChatButton.style.display = "none";
    });
      
    toggleChatButton.addEventListener("click", () => {
        if (window.innerWidth > 800) {
            // Desktop
            chatContainer.style.display = "none";
        } else {
            // Mobile
            chatContainer.classList.remove("open");
        }
        showChatButton.style.display = "block";
    });
    
    // Função para envio de mensagens com AJAX
    sendButton.addEventListener("click", function () {
        const message = messageInput.value.trim();
        if (message !== "") {
            addMessageToChat("user", message);
            messageInput.value = "";
    
            // Send the message to the server using AJAX
            fetch(`${window.location.origin}/sobralmapas/public/api/send-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    sender: "user",  // Include a sender field as Rasa expects
                    message: message
                }),
            })
            .then(response => {
                console.log('Resposta do servidor:', response);
    
                if (!response.ok) {
                    throw new Error("Erro ao comunicar com o servidor");
                }
                return response.json();  // Convert response to JSON
            })
            .then((data) => {
                console.log('Dados recebidos do servidor:', data);
    
                if (data && data.length > 0) {
                    data.forEach((msg) => {
                        addMessageToChat("bot", msg.text);
                    });
                } else {
                    addMessageToChat("bot", "Nenhuma resposta encontrada.");
                }
            })
            .catch((error) => {
                console.error("Erro:", error);
                addMessageToChat("bot", "Erro ao se comunicar com o servidor.");
            });
        }
    });
    
    // Enviar mensagem ao pressionar Enter
    messageInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Função para adicionar mensagens ao chat
    function addMessageToChat(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(
            "message",
            sender === "user" ? "sent" : "received"
        );
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        removeEmptyMessages();
    }

    // Função para remover mensagens vazias
    function removeEmptyMessages() {
        const messages = document.querySelectorAll(".message.received");
        messages.forEach((message) => {
            if (!message.textContent.trim()) {
                message.remove();
            }
        });
    }

    // Seletor para a primeira mensagem vazia
    const firstEmptyMessage = document.querySelector(".message.received");
    if (firstEmptyMessage) {
        firstEmptyMessage.remove();
    }
}

export function InitializeComponents() {
    initializeSelectionBox();
    initializeFloatingButton();
    initializeChat();
    initializeMeasure();
   
}
