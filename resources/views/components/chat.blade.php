<!-- resources/views/components/chat.blade.php -->
<!-- Botão para mostrar o chat -->
<button id="show-chat-button"><i class="fas fa-comment"></i>  <span> Chat - SobralMapas</span></button>

<div id="chat-container">
    <div class="chat-header">
        <div class="chat-title">
            <i class="fas fa-comment"></i>
            Chat - Sobral Mapas
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

<script>
    
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

</script>
