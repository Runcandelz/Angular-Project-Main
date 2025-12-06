import { Injectable, signal } from '@angular/core';

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'loading' | 'error';
  petType?: 'dog' | 'cat' | 'bird' | 'other'; // Changed from 'general' to 'other'
}

export interface PetProfile {
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  medicalConditions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages = signal<Message[]>([
    {
      id: 1,
      content: 'Hello! I\'m your AI Pet Buddy. Ask me anything about your pet\'s health, behavior, nutrition, or training. How can I help you today? 🐾',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);

  private petProfile = signal<PetProfile>({
    name: 'Buddy',
    type: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    weight: 70
  });

  // Mock AI responses for demo
  private aiResponses = [
    "That's a great question! Based on your pet's profile as a Golden Retriever, regular exercise and a balanced diet are key. For a 70lb dog, aim for at least 60 minutes of activity daily.",
    "I understand your concern. Many pets experience this behavior. It could be due to anxiety, boredom, or medical issues. Try increasing mental stimulation with puzzle toys.",
    "Always consult your veterinarian for medical advice. For general wellness, ensure fresh water is always available and maintain regular vet check-ups every 6-12 months.",
    "Nutrition is important! Consider high-quality protein sources and avoid foods with artificial additives. Remember, chocolate, grapes, and xylitol are toxic to dogs.",
    "Training tip: Use positive reinforcement! Reward good behavior immediately with treats or praise. Consistency is key for effective training.",
    "For behavioral issues, consider environmental enrichment. Rotating toys and providing safe chewing options can reduce destructive behavior.",
    "Based on your pet's age, regular health screenings are recommended. Senior pets may need adjustments to their diet and exercise routine."
  ];

  getMessages() {
    return this.messages.asReadonly();
  }

  getPetProfile() {
    return this.petProfile.asReadonly();
  }

  updatePetProfile(profile: Partial<PetProfile>) {
    this.petProfile.update(current => ({ ...current, ...profile }));
  }

  async sendMessage(content: string) {
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    this.messages.update(messages => [...messages, userMessage]);

    // Add loading indicator
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      type: 'loading'
    };
    
    this.messages.update(messages => [...messages, loadingMessage]);

    // Simulate AI thinking (for demo)
    await this.delay(800);

    // Remove loading message
    this.messages.update(messages => messages.filter(m => m.type !== 'loading'));

    // Add AI response
    const aiResponse: Message = {
      id: Date.now() + 2,
      content: this.generateAIResponse(content),
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      petType: this.petProfile().type
    };

    this.messages.update(messages => [...messages, aiResponse]);
  }

  clearChat() {
    this.messages.set([
      {
        id: 1,
        content: 'Hello! I\'m your AI Pet Buddy. Ask me anything about your pet\'s health, behavior, nutrition, or training. How can I help you today? 🐾',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  }

  private generateAIResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('food') || message.includes('diet') || message.includes('eat')) {
      return `For your ${this.petProfile().breed}, I recommend high-quality kibble with real meat as the first ingredient. Feed 2-3 cups daily, split into two meals. Avoid human foods like chocolate, grapes, and onions. 🍗`;
    }
    
    if (message.includes('exercise') || message.includes('walk') || message.includes('play')) {
      return `${this.petProfile().breed}s need at least 60 minutes of exercise daily. Mix walks with playtime and mental stimulation. Consider puzzle toys for indoor activities! 🎾`;
    }
    
    if (message.includes('sick') || message.includes('vomit') || message.includes('diarrhea')) {
      return '⚠️ **Important**: I cannot provide medical advice. If your pet shows signs of illness, please contact your veterinarian immediately. For non-emergency concerns, monitor symptoms and ensure hydration.';
    }
    
    if (message.includes('training') || message.includes('behavior') || message.includes('obey')) {
      return 'Use positive reinforcement training! Reward desired behaviors immediately with treats or praise. Keep sessions short (5-10 minutes) and consistent. Practice commands in different environments. 🏆';
    }
    
    if (message.includes('groom') || message.includes('bath') || message.includes('brush')) {
      return `For ${this.petProfile().breed}s, brush their coat 2-3 times weekly to prevent matting. Bathe every 4-6 weeks with dog-specific shampoo. Don't forget nail trims and ear cleaning! ✨`;
    }
    
    // Random response from our list
    const randomIndex = Math.floor(Math.random() * this.aiResponses.length);
    return this.aiResponses[randomIndex];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}