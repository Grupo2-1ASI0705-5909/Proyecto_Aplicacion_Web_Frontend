import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../service/chatbot.service';
import { Advice } from '../../model/AdviceResponse';
import { Subject, takeUntil } from 'rxjs';

interface ChatMessage {
    id: number;
    text: string;
    type: 'user' | 'bot';
    timestamp: Date;
    adviceId?: number;
}

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy {
    isMinimized = true;
    isLoading = false;
    messages: ChatMessage[] = [];
    private messageCounter = 0;
    errorMessage: string | null = null;
    private destroy$ = new Subject<void>();
    isAnimating = false;
    userInput = '';

    quickOptions = [
        { label: 'Consejos de ahorro', action: 'ahorro' },
        { label: 'Consejos de inversión', action: 'inversion' },
        { label: 'Seguridad cripto', action: 'seguridad' },
        { label: 'Presupuesto', action: 'presupuesto' }
    ];

    constructor(private chatbotService: ChatbotService) { }

    ngOnInit(): void {
        this.addBotMessage(
            'Hola. Soy tu asistente financiero. Puedo ayudarte con consejos sobre ahorro, inversión, criptomonedas y más. ¿En qué puedo ayudarte hoy?'
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleChatbot(): void {
        this.isMinimized = !this.isMinimized;
        this.errorMessage = null;
    }

    closeChatbot(): void {
        this.isMinimized = true;
    }

    obtenerNuevoConsejo(): void {
        this.isLoading = true;
        this.errorMessage = null;
        this.isAnimating = true;

        this.addUserMessage('Dame un consejo financiero');

        this.chatbotService.obtenerConsejoFinanciero()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (advice) => {
                    setTimeout(() => {
                        this.addBotMessage(advice.text, advice.id);
                        this.isLoading = false;
                        this.isAnimating = false;
                    }, 500);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.isAnimating = false;
                    this.addBotMessage(
                        'Lo siento, tuve un problema al generar un consejo. Por favor, inténtalo de nuevo.'
                    );
                    console.error('Error al obtener consejo:', error);
                }
            });
    }

    onSendMessage(): void {
        if (!this.userInput.trim() || this.isLoading) {
            return;
        }

        const userMessage = this.userInput.trim();
        this.addUserMessage(userMessage);
        this.userInput = '';

        this.procesarMensajeUsuario(userMessage);
    }

    private procesarMensajeUsuario(mensaje: string): void {
        this.isLoading = true;
        const mensajeLower = mensaje.toLowerCase();

        setTimeout(() => {
            if (this.contienePalabras(mensajeLower, ['hola', 'hi', 'buenos días', 'buenas tardes'])) {
                this.addBotMessage('Hola. ¿En qué puedo ayudarte con tus finanzas hoy?');
                this.isLoading = false;
            } else if (this.contienePalabras(mensajeLower, ['gracias', 'thanks', 'excelente'])) {
                this.addBotMessage('De nada. Estoy aquí para ayudarte. ¿Necesitas algo más?');
                this.isLoading = false;
            } else if (this.contienePalabras(mensajeLower, ['consejo', 'tip', 'ayuda', 'sugerencia'])) {
                this.obtenerConsejoContextual(mensajeLower);
            } else {
                this.obtenerConsejoContextual(mensajeLower);
            }
        }, 800);
    }

    private obtenerConsejoContextual(contexto: string): void {
        this.chatbotService.obtenerConsejoFinanciero()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (advice) => {
                    this.addBotMessage(advice.text, advice.id);
                    setTimeout(() => {
                        this.addBotMessage('¿Te gustaría otro consejo o tienes alguna pregunta?');
                    }, 1500);
                    this.isLoading = false;
                },
                error: () => {
                    this.addBotMessage('Lo siento, tuve un problema. ¿Podrías reformular tu pregunta?');
                    this.isLoading = false;
                }
            });
    }

    onQuickOption(action: string): void {
        let messageText = '';

        switch (action) {
            case 'ahorro':
                messageText = '¿Cómo puedo mejorar mis ahorros?';
                break;
            case 'inversion':
                messageText = 'Dame consejos sobre inversión';
                break;
            case 'seguridad':
                messageText = '¿Cómo protejo mis criptomonedas?';
                break;
            case 'presupuesto':
                messageText = 'Ayúdame con mi presupuesto';
                break;
        }

        this.addUserMessage(messageText);
        this.procesarMensajeUsuario(messageText);
    }

    private addUserMessage(text: string): void {
        this.messages.push({
            id: ++this.messageCounter,
            text: text,
            type: 'user',
            timestamp: new Date()
        });
        this.scrollToBottom();
    }

    private addBotMessage(text: string, adviceId?: number): void {
        this.messages.push({
            id: ++this.messageCounter,
            text: text,
            type: 'bot',
            timestamp: new Date(),
            adviceId: adviceId
        });
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            const chatBody = document.querySelector('.chatbot-body');
            if (chatBody) {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }, 100);
    }

    private contienePalabras(texto: string, palabras: string[]): boolean {
        return palabras.some(palabra => texto.includes(palabra));
    }

    reset(): void {
        this.messages = [];
        this.messageCounter = 0;
        this.errorMessage = null;
        this.userInput = '';
        this.ngOnInit();
    }

    onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.onSendMessage();
        }
    }
}
