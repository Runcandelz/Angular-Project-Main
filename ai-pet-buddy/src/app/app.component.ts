import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { QaComponent } from './components/qa.component';
//import { PetCareComponent } from './components/pet-care.component';

// --- Data Models ---
interface Employee {
  id: number;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  status: 'Active' | 'On Leave' | 'Intern';
  salary: number; // in thousands
  role: string;
  avatarColor: string;
}

interface PetProduct {
  name: string;
  price: number;
  features: string[];
  theme: 'Cosmic' | 'Forest' | 'Ocean' | 'Classic';
  highlight?: boolean;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgClass, QaComponent, /*PetCareComponent*/], // Add QaComponent here
  styles: [`
    /* --- Modern Tech Background --- */
    .bg-grid {
      background-size: 40px 40px;
      background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
    }
    .dark .bg-grid {
      background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    }
    
    /* --- Animations --- */
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-enter {
      animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }

    /* --- Gradient Text Utility --- */
    .text-gradient {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(to right, #0891b2, #2563eb); /* Cyan-600 to Blue-600 for better visibility */
    }
    .dark .text-gradient {
      background-image: linear-gradient(to right, #22d3ee, #60a5fa); /* Cyan-400 to Blue-400 for dark mode */
    }
  `],
  template: `
    <!-- Main App Wrapper -->
    <!-- Light Mode: bg-slate-50 text-slate-900 (High Contrast) -->
    <!-- Dark Mode: bg-slate-950 text-slate-100 -->
    <div [class]="(isDarkMode() ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900') + ' min-h-screen font-sans transition-colors duration-300 relative selection:bg-cyan-500 selection:text-white'">

      <!-- Clean Grid Background -->
      <div class="fixed inset-0 bg-grid pointer-events-none z-0 opacity-[0.4]"></div>

      <!-- Navbar -->
      <nav [class]="(isDarkMode() ? 'bg-slate-950/80 border-slate-800' : 'bg-white/90 border-slate-300') + ' sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300'">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20 items-center">
            
            <!-- Logo -->
            <div class="flex items-center gap-3 cursor-pointer group" (click)="setPage('Home')">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
                <span class="text-xl">🤖</span>
              </div>
              <span class="font-bold text-xl tracking-tight text-slate-950 dark:text-slate-100">AI Pet Buddy</span>
            </div>
            
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-full border border-slate-300 dark:border-slate-800">
              @for (page of navPages; track page) {
                <button 
                  (click)="setPage(page)"
                  [class]="currentPage() === page 
                    ? 'bg-white dark:bg-slate-800 text-cyan-800 dark:text-cyan-400 shadow-sm font-bold ring-1 ring-slate-200 dark:ring-0' 
                    : 'text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-white font-semibold'"
                  class="px-5 py-2 rounded-full text-sm transition-all duration-200">
                  {{ page }}
                </button>
              }
            </div>

            <!-- Theme Toggle -->
            <button 
              (click)="toggleTheme()" 
              [class]="(isDarkMode() ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-300') + ' p-2.5 rounded-full transition-all duration-200 shadow-sm'">
               @if (isDarkMode()) {
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               } @else {
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
               }
            </button>
          </div>
        </div>
      </nav>

      <!-- Content Area -->
      <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        @switch (currentPage()) {
          
          <!-- ================= HOME PAGE ================= -->
          @case ('Home') {
            <div class="flex flex-col items-center text-center pt-8 pb-20">
              
              <!-- Badge -->
              <div class="animate-enter inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/30 border border-cyan-300 dark:border-cyan-800 text-cyan-900 dark:text-cyan-300 text-sm font-bold mb-8">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-600 dark:bg-cyan-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-700 dark:bg-cyan-500"></span>
                </span>
                Version 2.0 Available Now
              </div>

              <!-- Hero Headline -->
              <h1 class="animate-enter delay-100 text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-950 dark:text-white">
                Your Companion, <br/>
                <span class="text-gradient">Powered by Code.</span>
              </h1>
              
              <!-- Fixed Text Contrast: Switched to slate-800/slate-300 -->
              <p class="animate-enter delay-200 text-xl text-slate-800 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                Experience the next generation of virtual pets. 
                <span class="font-bold text-slate-950 dark:text-white">Emotionally intelligent</span>, 
                <span class="font-bold text-slate-950 dark:text-white">zero-maintenance</span>, and designed for your mental well-being.
              </p>
              
              <!-- CTA Buttons -->
              <div class="animate-enter delay-300 flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20">
                <button (click)="setPage('Products')" class="px-8 py-4 bg-cyan-700 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-1">
                  Start Adoption
                </button>
                <button (click)="setPage('About')" class="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-lg font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                  Read Mission
                </button>
              </div>
              
              <!-- Bento Grid Features -->
              <div class="animate-enter delay-300 grid md:grid-cols-3 gap-6 w-full text-left">
                <!-- Feature 1 -->
                <div [class]="(isDarkMode() ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300') + ' p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group'">
                  <div class="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🐈</div>
                  <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">Cyber Cat</h3>
                  <p class="text-slate-700 dark:text-slate-400 leading-relaxed font-medium">Simulates complex feline affection algorithms. Purrs at therapeutic frequencies.</p>
                </div>
                <!-- Feature 2 -->
                <div [class]="(isDarkMode() ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300') + ' p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group'">
                  <div class="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🐕</div>
                  <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">Data Dog</h3>
                  <p class="text-slate-700 dark:text-slate-400 leading-relaxed font-medium">High-energy neural networks. Always happy to see you login.</p>
                </div>
                <!-- Feature 3 -->
                <div [class]="(isDarkMode() ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300') + ' p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group'">
                  <div class="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🦉</div>
                  <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">Logic Owl</h3>
                  <p class="text-slate-700 dark:text-slate-400 leading-relaxed font-medium">Connected to global knowledge bases. Wisdom on demand.</p>
                </div>
              </div>

            </div>
          }

          <!-- ================= ABOUT PAGE ================= -->
          @case ('About') {
            <div class="animate-enter grid lg:grid-cols-2 gap-16 items-center py-12">
              <div>
                <div class="inline-block px-3 py-1 mb-4 rounded bg-cyan-100 dark:bg-cyan-900/30 text-cyan-900 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-200 dark:border-none">Our Story</div>
                <h1 class="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                  We engineered loneliness <br/> out of the system.
                </h1>
                <div class="space-y-6 text-lg text-slate-800 dark:text-slate-300 font-medium">
                  <p>
                    AI Pet Buddy Co. was founded in 2024. While other tech giants built faster processors, we focused on <strong class="text-slate-950 dark:text-white">warmer algorithms</strong>.
                  </p>
                  <p>
                    Our "Pet Behavior Engineers" don't just write code; they study psychology. Every virtual pet is equipped with an Emotional Core™ that evolves based on how you treat it.
                  </p>
                  
                  <div class="grid grid-cols-2 gap-4 mt-8">
                    <div [class]="(isDarkMode() ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-300') + ' p-5 rounded-xl border'">
                      <div class="text-3xl mb-2">🔒</div>
                      <div class="font-bold text-slate-900 dark:text-white mb-1">100% Private</div>
                      <div class="text-sm text-slate-700 dark:text-slate-400 opacity-90">Local encryption ensures your bond stays between you and your buddy.</div>
                    </div>
                    <div [class]="(isDarkMode() ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-300') + ' p-5 rounded-xl border'">
                      <div class="text-3xl mb-2">🧠</div>
                      <div class="font-bold text-slate-900 dark:text-white mb-1">Evolving AI</div>
                      <div class="text-sm text-slate-700 dark:text-slate-400 opacity-90">No two pets are alike. Your buddy grows unique traits over time.</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Visual Graphic -->
              <div class="relative animate-float">
                <div class="absolute top-0 left-4 right-4 bottom-0 bg-cyan-500/20 rounded-3xl transform rotate-6 scale-95 z-0"></div>
                <div [class]="(isDarkMode() ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300') + ' relative z-10 rounded-3xl shadow-2xl overflow-hidden border p-8 flex flex-col items-center justify-center text-center aspect-square'">
                    <div class="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-6xl shadow-lg mb-6">
                      🤖
                    </div>
                    <h3 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Unit #8842</h3>
                    <p class="text-slate-600 dark:text-slate-400 font-bold">"I learned a new trick today!"</p>
                    <div class="mt-6 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div class="bg-cyan-600 dark:bg-cyan-500 h-full w-3/4 rounded-full"></div>
                    </div>
                    <div class="flex justify-between w-full text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono font-bold">
                      <span>Happiness: 75%</span>
                      <span>Level: 12</span>
                    </div>
                </div>
              </div>
            </div>
          }

          <!-- ================= PRODUCTS PAGE ================= -->
          @case ('Products') {
            <div class="animate-enter py-8">
              <div class="text-center max-w-2xl mx-auto mb-16">
                <h2 class="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Pricing Plans</h2>
                <p class="text-lg text-slate-700 dark:text-slate-400 font-medium">
                  Transparent pricing. No hidden fees. Cancel anytime.
                </p>
              </div>

              <div class="grid lg:grid-cols-3 gap-8 items-start">
                @for (prod of products; track prod.name) {
                  <div [class]="(isDarkMode() ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300') + ' relative rounded-2xl p-8 border transition-all duration-300 flex flex-col ' + (prod.highlight ? 'border-cyan-500 shadow-xl shadow-cyan-500/10 scale-105 z-10' : 'hover:border-cyan-400 hover:shadow-lg')">
                    
                    @if (prod.highlight) {
                      <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                        Most Popular
                      </div>
                    }

                    <div class="mb-6">
                      <h3 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{{ prod.name }}</h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400 h-10 leading-relaxed font-bold">{{ prod.description }}</p>
                    </div>

                    <div class="mb-8 flex items-baseline">
                      <span class="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{{ '$' + prod.price }}</span>
                      <span class="text-slate-600 dark:text-slate-400 ml-2 font-bold">/month</span>
                    </div>

                    <button [class]="(prod.highlight ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent') + ' w-full py-3 rounded-lg font-bold mb-8 transition-colors'">
                      Get Started
                    </button>

                    <div class="space-y-4 flex-grow border-t border-slate-200 dark:border-slate-800 pt-6">
                      @for (feat of prod.features; track feat) {
                        <div class="flex items-start">
                          <div class="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 flex items-center justify-center text-xs mr-3 mt-0.5 font-bold">✓</div>
                          <span class="text-sm text-slate-700 dark:text-slate-300 font-semibold">{{ feat }}</span>
                        </div>
                      }
                    </div>

                  </div>
                }
              </div>
            </div>
          }

          <!-- ================= DIRECTORY PAGE ================= -->
          @case ('Directory') {
            <div class="animate-enter max-w-5xl mx-auto">
              <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                  <h2 class="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Team Directory</h2>
                  <p class="text-slate-700 dark:text-slate-400 font-medium">The engineers and creatives behind the AI.</p>
                </div>
                
                <!-- Search Input -->
                <div class="relative w-full md:w-72">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-slate-500 dark:text-slate-400">🔍</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search team..." 
                    (input)="filterEmployees($event)"
                    [class]="(isDarkMode() ? 'bg-slate-900 border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-cyan-600 text-slate-900 placeholder-slate-500') + ' w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all font-medium'"
                  >
                </div>
              </div>

              <!-- Table Card -->
              <div [class]="(isDarkMode() ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300') + ' rounded-xl shadow-sm border overflow-hidden'">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr [class]="isDarkMode() ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-800 border-b border-slate-200'">
                        <th class="p-5 text-xs font-extrabold uppercase tracking-wider">Employee</th>
                        <th class="p-5 text-xs font-extrabold uppercase tracking-wider">Role</th>
                        <th class="p-5 text-xs font-extrabold uppercase tracking-wider">Status</th>
                        <th class="p-5 text-xs font-extrabold uppercase tracking-wider text-right">Comp.</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                      @for (emp of filteredEmployees(); track emp.id) {
                        <tr [class]="'group transition-colors ' + (isDarkMode() ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50')">
                          <td class="p-5">
                            <div class="flex items-center">
                              <div [class]="'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-sm ' + emp.avatarColor">
                                {{ emp.name.charAt(0) }}
                              </div>
                              <div>
                                <div class="font-bold text-slate-900 dark:text-white">{{ emp.name }}</div>
                                <div class="text-xs text-slate-600 dark:text-slate-400 font-bold">{{ emp.email }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="p-5 text-sm font-bold text-slate-700 dark:text-slate-300">{{ emp.role }}</td>
                          <td class="p-5">
                            <span [class]="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ' + 
                              (emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' : 
                              (emp.status === 'Intern' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900' : 
                              'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'))">
                              {{ emp.status }}
                            </span>
                          </td>
                          <td class="p-5 text-right font-mono text-sm font-bold text-slate-900 dark:text-slate-200">
                            {{ '$' + emp.salary + 'k' }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                
                @if (filteredEmployees().length === 0) {
                  <div class="p-12 text-center text-slate-500 font-medium">
                    <p class="text-lg">No results found.</p>
                    <p class="text-sm">Try adjusting your search terms.</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- ================= Q&A PAGE ================= -->
          @case ('Q&A') {
            <app-qa [isDarkMode]="isDarkMode()" />
          }

          <!-- ================= 404 PAGE ================= -->
          @default {
            <div class="animate-enter flex flex-col items-center justify-center py-24 text-center">
              <div class="text-[120px] leading-none mb-4 select-none grayscale opacity-50">🐩</div>
              <h1 class="text-8xl font-black text-slate-300 dark:text-slate-700 mb-2">404</h1>
              <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">Pet Not Found</h2>
              <p class="text-lg text-slate-700 dark:text-slate-400 mb-10 max-w-md mx-auto font-medium">
                The virtual companion you are looking for has wandered into a different server.
              </p>
              <button (click)="setPage('Home')" class="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-1">
                Go Back Home
              </button>
            </div>
          }
        }
      </main>

      <!-- Footer -->
      <footer [class]="(isDarkMode() ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300') + ' border-t mt-auto py-12'">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <div class="flex justify-center items-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <span class="text-2xl">🤖</span>
             <span class="font-bold text-slate-900 dark:text-white">AI Pet Buddy Co.</span>
          </div>
          <p class="text-slate-700 dark:text-slate-500 text-sm font-bold">
            © 2025 AI Pet Buddy Inc. All rights reserved. <br/>
            Engineered with ❤️ and Angular.
          </p>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  // State
  currentPage = signal<string>('Home');
  isDarkMode = signal<boolean>(false);
  searchTerm = signal<string>('');
  
  navPages = ['Home', 'About', 'Products', 'Directory', 'Q&A', /*'Pet Care'*/]; // Add Q&A here

  // Data: Employees
  employees: Employee[] = [
    { id: 101, name: 'Dr. Sarah Smith', gender: 'Female', email: 's.smith@pets.ai', status: 'Active', salary: 120, role: 'Chief Neural Architect', avatarColor: 'bg-rose-500' },
    { id: 102, name: 'John Doe', gender: 'Male', email: 'j.doe@pets.ai', status: 'Active', salary: 95, role: 'Senior Pet Trainer', avatarColor: 'bg-blue-500' },
    { id: 103, name: 'Alex Ray', gender: 'Other', email: 'a.ray@pets.ai', status: 'Intern', salary: 40, role: 'Digital Grooming Intern', avatarColor: 'bg-purple-500' },
    { id: 104, name: 'Emily White', gender: 'Female', email: 'e.white@pets.ai', status: 'On Leave', salary: 85, role: 'Customer Happiness', avatarColor: 'bg-amber-500' },
    { id: 105, name: 'Marcus Chen', gender: 'Male', email: 'm.chen@pets.ai', status: 'Active', salary: 110, role: 'Backend Veterinarian', avatarColor: 'bg-emerald-500' },
    { id: 106, name: 'Lisa Wong', gender: 'Female', email: 'l.wong@pets.ai', status: 'Active', salary: 105, role: 'AI Ethics Officer', avatarColor: 'bg-cyan-500' }
  ];

  // Data: Products
  products: PetProduct[] = [
    { 
      name: 'Basic Buddy', 
      price: 9, 
      theme: 'Classic', 
      description: 'Perfect for first-time digital pet owners.',
      features: ['Text Chat Interface', '3 Basic Emotions', 'Tamagotchi Mode', 'Standard Support'] 
    },
    { 
      name: 'Pro Pal', 
      price: 19, 
      theme: 'Cosmic', 
      highlight: true, 
      description: 'Our most popular plan for deep companionship.',
      features: ['Voice Synthesis (Natural)', 'Video Call Capability', 'Advanced Learning Algo', 'Cloud Memory Backup', 'Priority Support'] 
    },
    { 
      name: 'Ultra Companion', 
      price: 29, 
      theme: 'Ocean', 
      description: 'Cutting-edge sentient simulation.',
      features: ['VR/AR Hologram Mode', 'Full Sentience (Beta)', 'Cognitive Therapy Skills', 'Dedicated Quantum Server', '24/7 Concierge'] 
    }
  ];

  // Computed signal for search filtering
  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.employees.filter(emp => 
      emp.name.toLowerCase().includes(term) || 
      emp.role.toLowerCase().includes(term)
    );
  });

  setPage(pageName: string) {
    if (this.navPages.includes(pageName)) {
      this.currentPage.set(pageName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.currentPage.set('404');
    }
  }

  toggleTheme() {
    this.isDarkMode.update(d => !d);
  }

  filterEmployees(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}