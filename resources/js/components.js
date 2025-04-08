import { toggleLayer } from "./map";
// Função para inicializar a caixa de seleção (mover e redimensionar)
function initializeSelectionBox() {
    const selectionBox = document.getElementById("selection-box");
    const dragHandle = document.getElementById("drag-handle");
    const selectionButton = document.getElementById("selection-button");
    const selectionTools = document.querySelector(".selection-tools");
    const resolution = document.getElementById("resolution");
    const selectionArea = document.getElementById("selection-area");
    const downloadButton = document.getElementById('download-button');
    const scaleInput = document.getElementById('scale');

    let isDragging = false;
    let startX, startY, offsetX, offsetY;

    // Verifica se os elementos estão presentes
    if (selectionButton && selectionTools) {
        selectionButton.addEventListener("click", function () {
            // Alterna a visibilidade da div "selection-tools"
            if (
                selectionTools.style.display === "none" ||
                selectionTools.style.display === ""
            ) {
                selectionButton.classList.add("active");
                selectionTools.style.display = "block"; // Exibe o selection-tools
            } else {
                selectionTools.style.display = "none"; // Oculta o selection-tools
                selectionButton.classList.remove("active");
            }
        });
    }

    // Função para atualizar as dimensões no cabeçalho
    function updateDimensions() {
        const width = selectionArea.offsetWidth;
        const height = selectionArea.offsetHeight;
        resolution.innerHTML = `${width} x ${height}`;
    }

    // Iniciar o arraste ao clicar no cabeçalho
    dragHandle.addEventListener("mousedown", function (e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Pega a posição inicial da caixa de seleção
        offsetX = selectionBox.offsetLeft;
        offsetY = selectionBox.offsetTop;

        e.preventDefault(); // Previne seleção de texto
    });

    // Mover a caixa durante o arraste
    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            const moveX = e.clientX - startX;
            const moveY = e.clientY - startY;

            // Atualizar a posição da caixa de seleção
            selectionBox.style.left = offsetX + moveX + "px";
            selectionBox.style.top = offsetY + moveY + "px";
        }
    });

    // Finalizar o arraste ao soltar o mouse
    document.addEventListener("mouseup", function () {
        isDragging = false;
        updateDimensions(); // Atualiza as dimensões após o movimento
    });

    // Atualizar as dimensões quando a página carregar
    updateDimensions();

    // Função que escuta o redimensionamento da caixa
    const resizeObserver = new ResizeObserver(() => {
        updateDimensions(); // Atualiza as dimensões após o redimensionamento
    });

    // Observar mudanças na caixa de seleção
    resizeObserver.observe(selectionBox);

    if (downloadButton) {
        // downloadButton.addEventListener('click', async () => {
        //     const selectionBox = document.getElementById('selection-area');
        //     const map = document.querySelector('#map canvas'); // atualizado para OpenLayers
        
        //     if (!selectionBox || !map) {
        //         console.log("Mapa ou área de seleção não encontrados.");
        //         return;
        //     }
        
        //     const format = document.getElementById('format').value;
        //     const scale = document.getElementById('scale').value;
        
        //     const mapRect = map.getBoundingClientRect();
        //     const selectionRect = selectionBox.getBoundingClientRect();
        
        //     const left = selectionRect.left - mapRect.left;
        //     const top = selectionRect.top - mapRect.top;
        //     const width = selectionRect.width;
        //     const height = selectionRect.height;
        
        //     html2canvas(map, {
        //         useCORS: true,
        //         scale: 1
        //     }).then(canvas => {
        //         const croppedCanvas = document.createElement('canvas');
        //         croppedCanvas.width = width;
        //         croppedCanvas.height = height;
        
        //         const ctx = croppedCanvas.getContext('2d');
        //         ctx.drawImage(canvas, left, top, width, height, 0, 0, width, height);
        
        //         const imgData = croppedCanvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`);
        
        //         if (format === 'pdf') {
        //             const { jsPDF } = window.jspdf;
        //             const pdf = new jsPDF({
        //                 orientation: width > height ? 'landscape' : 'portrait',
        //                 unit: 'px',
        //                 format: [width, height]
        //             });
        //             pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        //             pdf.save('mapa_selecionado.pdf');
        //         } else {
        //             const link = document.createElement('a');
        //             link.href = imgData;
        //             link.download = `mapa_selecionado.${format}`;
        //             link.click();
        //         }
        //     }).catch(err => {
        //         console.error("Erro ao capturar o mapa:", err);
        //     });
        // });

        downloadButton.addEventListener('click', async () => {
            const selectionArea = document.getElementById('selection-area');
            const mapCanvas = document.querySelector('#map canvas');
        
            if (!selectionArea || !mapCanvas) {
                console.error("Mapa ou área de seleção não encontrados.");
                return;
            }
        
            const format = document.getElementById('format').value;
            const scaleValue = parseFloat(document.getElementById('scale').value);
        
            const mapRect = mapCanvas.getBoundingClientRect();
            const selectionRect = selectionArea.getBoundingClientRect();
        
            const left = selectionRect.left - mapRect.left;
            const top = selectionRect.top - mapRect.top;
            const width = selectionRect.width;
            const height = selectionRect.height;
        
            const olMap = window.map; // Usa a instância global do mapa
            const view = olMap.getView();
            const originalResolution = view.getResolution();
        
            // Cálculo da nova resolução
            const dpi = 96;
            const newResolution = scaleValue / (dpi * 39.37);
        
            // Aplicar nova resolução
            view.setResolution(newResolution);
        
            // Aguardar a renderização
            setTimeout(() => {
                html2canvas(mapCanvas, { useCORS: true, scale: 1 }).then(canvas => {
                    const croppedCanvas = document.createElement('canvas');
                    croppedCanvas.width = width;
                    croppedCanvas.height = height;
        
                    const ctx = croppedCanvas.getContext('2d');
                    ctx.drawImage(canvas, left, top, width, height, 0, 0, width, height);
        
                    const imgData = croppedCanvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`);
        
                    if (format === 'pdf') {
                        const { jsPDF } = window.jspdf;
                        const pdf = new jsPDF({
                            orientation: width > height ? 'landscape' : 'portrait',
                            unit: 'px',
                            format: [width, height]
                        });
                        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                        pdf.save('mapa_selecionado.pdf');
                    } else {
                        const link = document.createElement('a');
                        link.href = imgData;
                        link.download = `mapa_selecionado.${format}`;
                        link.click();
                    }
        
                    view.setResolution(originalResolution);
                }).catch(err => {
                    console.error("Erro ao capturar o mapa:", err);
                    view.setResolution(originalResolution);
                });
            }, 500); // Pequeno delay para garantir renderização
        });
        
        
    }
    
    if (scaleInput) {
        const debouncedScaleUpdate = debounce(updateMapFromScaleInput, 400);
        scaleInput.addEventListener('input', debouncedScaleUpdate);
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
                        width: 5,
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
                handleServerResponse(data);
    
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
function handleServerResponse(responseData) {
    // Verifica se há um objeto com `map_type` na resposta
    const mapTypeData = responseData.find(item => item.custom && item.custom.map_type);
    
    if (mapTypeData) {
        const mapType = mapTypeData.custom.map_type.toLowerCase();
        console.log(`📍 Tentando marcar a camada: ${mapType}`);

        // Expande o menu lateral automaticamente
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            sidebar.classList.add("open"); // Certifique-se de que essa classe abre o menu
        }

        // Percorre todas as camadas e encontra a que corresponde ao `map_type`
        let foundLayer = false;
        document.querySelectorAll(".layer-toggle").forEach(layerCheckbox => {
            let layerData;

            try {
                layerData = JSON.parse(layerCheckbox.getAttribute("data-layer").replace(/&quot;/g, '"'));
                if (typeof layerData === "string") {
                    layerData = JSON.parse(layerData);
                }

                // Se o `map_type` for igual ao nome da camada, marca e ativa
                if (layerData.name.toLowerCase() === mapType) {
                    foundLayer = true;
                    layerCheckbox.checked = true;
                    console.log(`✅ Marcando automaticamente: ${layerData.layer_name}`);

                    // 🚀 Disparar evento "change" para ativar a camada no mapa
                    layerCheckbox.dispatchEvent(new Event("change"));

                    // Atualiza estatísticas
                    window.updateStatistics(layerData, true);

                    // Adiciona a camada ao mapa
                    toggleLayer(window.map, layerData, true);

                    // **Abre automaticamente a categoria e subcategoria**
                    expandCategoryAndSubcategory(layerCheckbox);
                }
            } catch (error) {
                console.error("❌ ERRO ao processar data-layer:", error);
            }
        });

        if (!foundLayer) {
            console.warn("⚠ Nenhuma camada correspondente encontrada para:", mapType);
        }
    }
}

// **Função para abrir a categoria e subcategoria automaticamente**
function expandCategoryAndSubcategory(layerCheckbox) {
    // Encontra a subcategoria e categoria associadas
    let subcategory = layerCheckbox.closest(".accordion-item.sub");
    let category = layerCheckbox.closest(".accordion-item.cat");

    // Expande a subcategoria se estiver fechada
    if (subcategory) {
        subcategory.style.display = "block";
        let subCategoryButton = subcategory.querySelector(".accordion-button");
        if (subCategoryButton) {
            subCategoryButton.classList.remove("collapsed");
            subCategoryButton.setAttribute("aria-expanded", "true");
            let subCategoryContent = document.querySelector(`#${subCategoryButton.getAttribute("data-bs-target").substring(1)}`);
            if (subCategoryContent) {
                subCategoryContent.classList.add("show");
            }
        }
    }

    // Expande a categoria se estiver fechada
    if (category) {
        category.style.display = "block";
        let categoryButton = category.querySelector(".accordion-button");
        if (categoryButton) {
            categoryButton.classList.remove("collapsed");
            categoryButton.setAttribute("aria-expanded", "true");
            let categoryContent = document.querySelector(`#${categoryButton.getAttribute("data-bs-target").substring(1)}`);
            if (categoryContent) {
                categoryContent.classList.add("show");
            }
        }
    }
}

function initializeResolutionWatcher() {
    const view = window.map.getView();
    const resolutionElement = document.getElementById('resolution');
    const scaleInput = document.getElementById('scale');

    if (!view) return;

    const updateUI = () => {
        const res = view.getResolution();
        if (resolutionElement) {
            resolutionElement.innerText = `${Math.round(res * 1000)} x ${Math.round(res * 1000)}`;
        }
        if (scaleInput) {
            scaleInput.value = resolutionToScale(res);
        }
    };

    // Atualiza ao carregar e sempre que a resolução mudar
    updateUI();
    view.on('change:resolution', updateUI);
}

const DPI = 96;

// Converte resolução do mapa para escala (ex: 1:10000)
function resolutionToScale(resolution) {
    return Math.round(resolution * DPI * 39.37);
}

// Converte escala para resolução
function scaleToResolution(scale) {
    return scale / (DPI * 39.37);
}

// Atualiza o input #scale com a escala baseada na resolução atual
function updateScaleInputFromMap() {
    const view = window.map.getView();
    const scaleInput = document.getElementById('scale');
    if (!view || !scaleInput) return;

    const resolution = view.getResolution();
    const escala = resolutionToScale(resolution);
    scaleInput.value = escala;
}

// Altera o zoom do mapa baseado no valor digitado no input de escala
function updateMapFromScaleInput() {
    const scaleInput = document.getElementById('scale');
    const scaleMin = 4514;
    if (!scaleInput) return;

    let scaleValue = parseFloat(scaleInput.value);
    if (isNaN(scaleValue)) return;
    if (scaleValue < scaleMin) {
        scaleInput.value = scaleMin;
        scaleValue = scaleMin;
    }

    const resolution = scaleToResolution(scaleValue);
    const view = window.map.getView();
    view.setResolution(resolution);
}

// retarda a ação input
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}


export function InitializeComponents() {
    initializeSelectionBox();
    initializeResolutionWatcher();
    initializeFloatingButton();
    initializeChat();
    initializeMeasure();
    handleServerResponse();
    updateScaleInputFromMap(); // Ao carregar, preenche o campo de escala com o zoom atual
}
