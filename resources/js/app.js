import { InitializeUI } from "./ui";
import { InitializeComponents } from "./components";
import { initializeMap } from "./map";

// IIFE (Immediately Invoked Function Expression) para encapsular o código
(() => {
    "use strict";

    // Função principal que inicializa todas as funcionalidades
    async function initializeApp() {
        console.log("initializeApp foi chamado com sucesso."); // Log para verificar se initializeApp é chamado

        // Verificação de initializeMap
        try {
            console.log("Iniciando initializeMap...");
            initializeMap();
            console.log("initializeMap carregado com sucesso.");
        } catch (error) {
            console.log("Erro ao carregar initializeMap: " + error.message);
            console.error("Erro ao carregar initializeMap:", error);
        }

        // Verificação de InitializeUI
        try {
            console.log("Iniciando InitializeUI...");
            InitializeUI();
            console.log("InitializeUI carregado com sucesso.");
        } catch (error) {
            console.log("Erro ao carregar InitializeUI: " + error.message);
            console.error("Erro ao carregar InitializeUI:", error);
        }

        // Verificação de InitializeComponents
        try {
            console.log("Iniciando InitializeComponents...");
            InitializeComponents();
            console.log("InitializeComponents carregado com sucesso.");
        } catch (error) {
            console.log("Erro ao carregar InitializeComponents: " + error.message);
            console.error("Erro ao carregar InitializeComponents:", error);
        }
    }

    // Executa a função principal quando o DOM estiver pronto
    document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM completamente carregado."); // Log para garantir que o evento DOMContentLoaded foi acionado
        initializeApp();
    });

    // Garante que o tooltip desapareça quando o mouse sair do botão
    document.getElementById('toggleSidebar').addEventListener('click', function () {
        var tooltip = bootstrap.Tooltip.getInstance(this);
        if (tooltip) {
            tooltip.hide();
        }
    });
})();
