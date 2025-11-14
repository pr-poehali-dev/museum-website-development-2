import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const exhibits = [
    {
      id: 1,
      title: 'Античная скульптура',
      period: 'III век до н.э.',
      image: 'https://cdn.poehali.dev/projects/8a771729-5b69-449c-843a-a57495ac4956/files/10997e98-cb29-410d-957c-0569786a3cdb.jpg',
      description: 'Мраморная статуя древнегреческого периода'
    },
    {
      id: 2,
      title: 'Золото фараонов',
      period: 'XIV век до н.э.',
      image: 'https://cdn.poehali.dev/projects/8a771729-5b69-449c-843a-a57495ac4956/files/07f8b567-658f-4740-b7ce-c505eae126de.jpg',
      description: 'Золотая маска египетского правителя'
    },
    {
      id: 3,
      title: 'Рыцарские доспехи',
      period: 'XV век н.э.',
      image: 'https://cdn.poehali.dev/projects/8a771729-5b69-449c-843a-a57495ac4956/files/34847715-07f9-41ce-a7e8-d4ee2b7d8683.jpg',
      description: 'Полный комплект средневековых доспехов'
    }
  ];

  const virtualTours = [
    {
      id: 1,
      title: 'Античный зал',
      duration: '25 минут',
      icon: 'Columns3',
      viewers: 1250
    },
    {
      id: 2,
      title: 'Египетская коллекция',
      duration: '30 минут',
      icon: 'Pyramid',
      viewers: 2100
    },
    {
      id: 3,
      title: 'Средневековье',
      duration: '20 минут',
      icon: 'Castle',
      viewers: 890
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Landmark" size={32} className="text-secondary" />
            <h1 className="text-2xl font-bold text-primary">Музей</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setActiveSection('home')}
              className="text-foreground hover:text-secondary transition-colors"
            >
              Главная
            </button>
            <button 
              onClick={() => setActiveSection('exhibits')}
              className="text-foreground hover:text-secondary transition-colors"
            >
              Экспонаты
            </button>
            <button 
              onClick={() => setActiveSection('tours')}
              className="text-foreground hover:text-secondary transition-colors"
            >
              Виртуальные экскурсии
            </button>
            <button className="text-foreground hover:text-secondary transition-colors">
              О музее
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Icon name="Search" size={20} />
            </Button>
            <Button onClick={() => setIsLoginOpen(true)} className="bg-accent hover:bg-accent/90">
              <Icon name="User" size={18} className="mr-2" />
              Войти
            </Button>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(26, 31, 44, 0.7), rgba(26, 31, 44, 0.7)), url('https://cdn.poehali.dev/projects/8a771729-5b69-449c-843a-a57495ac4956/files/10997e98-cb29-410d-957c-0569786a3cdb.jpg')`,
            }}
          />
          <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
            <Badge className="mb-4 bg-secondary text-primary">Откройте мир искусства</Badge>
            <h2 className="text-6xl font-bold text-white mb-6">
              Путешествие сквозь эпохи
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Исследуйте тысячелетнюю историю человечества через уникальные экспонаты и интерактивные виртуальные экскурсии
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary">
                <Icon name="Play" size={20} className="mr-2" />
                Начать экскурсию
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                Узнать больше
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h3 className="text-4xl font-bold text-primary mb-4">Избранные экспонаты</h3>
              <p className="text-muted-foreground text-lg">Познакомьтесь с жемчужинами нашей коллекции</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {exhibits.map((exhibit, index) => (
                <Card 
                  key={exhibit.id} 
                  className="group overflow-hidden border-border hover:shadow-2xl transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={exhibit.image} 
                      alt={exhibit.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">{exhibit.period}</Badge>
                    <h4 className="text-2xl font-semibold text-primary mb-2">{exhibit.title}</h4>
                    <p className="text-muted-foreground mb-4">{exhibit.description}</p>
                    <Button variant="ghost" className="w-full group-hover:bg-accent group-hover:text-accent-foreground">
                      Подробнее
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-primary mb-4">Виртуальные экскурсии</h3>
              <p className="text-muted-foreground text-lg">Откройте музей из любой точки мира</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {virtualTours.map((tour) => (
                <Card key={tour.id} className="hover:shadow-lg transition-shadow duration-300 border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Icon name={tour.icon} size={32} className="text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-primary mb-2">{tour.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {tour.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Users" size={14} />
                            {tour.viewers}
                          </span>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <Icon name="Video" size={16} className="mr-2" />
                          Начать тур
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-4xl font-bold mb-6">Присоединяйтесь к нашему сообществу</h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Следите за новостями, выставками и специальными мероприятиями
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Icon name="Facebook" size={20} className="mr-2" />
                Facebook
              </Button>
              <Button size="lg" variant="secondary">
                <Icon name="Instagram" size={20} className="mr-2" />
                Instagram
              </Button>
              <Button size="lg" variant="secondary">
                <Icon name="Twitter" size={20} className="mr-2" />
                Twitter
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Landmark" size={28} className="text-secondary" />
                <h3 className="text-xl font-bold">Музей</h3>
              </div>
              <p className="opacity-80">Храним историю для будущих поколений</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <ul className="space-y-2 opacity-80">
                <li>О музее</li>
                <li>Экспонаты</li>
                <li>Экскурсии</li>
                <li>Контакты</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 opacity-80">
                <li>Режим работы</li>
                <li>Билеты</li>
                <li>Правила посещения</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 opacity-80">
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  г. Москва, ул. Музейная, 1
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 123-45-67
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@museum.ru
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center opacity-80">
            <p>&copy; 2024 Музей. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Вход в личный кабинет</DialogTitle>
            <DialogDescription>
              Войдите для доступа к избранному и персональным экскурсиям
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full bg-accent hover:bg-accent/90">
              Войти
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <button className="text-accent hover:underline">
                Зарегистрироваться
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
