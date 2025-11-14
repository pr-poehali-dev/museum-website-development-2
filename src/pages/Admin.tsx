import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Exhibit {
  id: number;
  title: string;
  period: string;
  description: string;
  image_url: string;
  category: string;
  location: string;
}

interface VirtualTour {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  video_url: string;
  thumbnail_url: string;
  category: string;
  viewers_count: number;
}

const EXHIBITS_API = 'https://functions.poehali.dev/a5f75286-e43d-41cf-9f8e-a0761fc19330';
const TOURS_API = 'https://functions.poehali.dev/6e807a4d-b14e-4443-b1c0-a408a63c11d7';

const Admin = () => {
  const navigate = useNavigate();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [tours, setTours] = useState<VirtualTour[]>([]);
  const [isExhibitDialogOpen, setIsExhibitDialogOpen] = useState(false);
  const [isTourDialogOpen, setIsTourDialogOpen] = useState(false);
  const [editingExhibit, setEditingExhibit] = useState<Exhibit | null>(null);
  const [editingTour, setEditingTour] = useState<VirtualTour | null>(null);

  const [exhibitForm, setExhibitForm] = useState({
    title: '',
    period: '',
    description: '',
    image_url: '',
    category: '',
    location: ''
  });

  const [tourForm, setTourForm] = useState({
    title: '',
    description: '',
    duration_minutes: 0,
    video_url: '',
    thumbnail_url: '',
    category: ''
  });

  useEffect(() => {
    fetchExhibits();
    fetchTours();
  }, []);

  const fetchExhibits = async () => {
    try {
      const response = await fetch(EXHIBITS_API);
      const data = await response.json();
      setExhibits(data);
    } catch (error) {
      toast.error('Ошибка загрузки экспонатов');
    }
  };

  const fetchTours = async () => {
    try {
      const response = await fetch(TOURS_API);
      const data = await response.json();
      setTours(data);
    } catch (error) {
      toast.error('Ошибка загрузки экскурсий');
    }
  };

  const handleCreateExhibit = async () => {
    try {
      const response = await fetch(EXHIBITS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exhibitForm)
      });
      
      if (response.ok) {
        toast.success('Экспонат создан');
        setIsExhibitDialogOpen(false);
        fetchExhibits();
        resetExhibitForm();
      }
    } catch (error) {
      toast.error('Ошибка создания экспоната');
    }
  };

  const handleUpdateExhibit = async () => {
    if (!editingExhibit) return;
    
    try {
      const response = await fetch(EXHIBITS_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...exhibitForm, id: editingExhibit.id })
      });
      
      if (response.ok) {
        toast.success('Экспонат обновлен');
        setIsExhibitDialogOpen(false);
        fetchExhibits();
        resetExhibitForm();
        setEditingExhibit(null);
      }
    } catch (error) {
      toast.error('Ошибка обновления экспоната');
    }
  };

  const handleDeleteExhibit = async (id: number) => {
    if (!confirm('Удалить этот экспонат?')) return;
    
    try {
      const response = await fetch(`${EXHIBITS_API}?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Экспонат удален');
        fetchExhibits();
      }
    } catch (error) {
      toast.error('Ошибка удаления экспоната');
    }
  };

  const handleCreateTour = async () => {
    try {
      const response = await fetch(TOURS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourForm)
      });
      
      if (response.ok) {
        toast.success('Экскурсия создана');
        setIsTourDialogOpen(false);
        fetchTours();
        resetTourForm();
      }
    } catch (error) {
      toast.error('Ошибка создания экскурсии');
    }
  };

  const handleUpdateTour = async () => {
    if (!editingTour) return;
    
    try {
      const response = await fetch(TOURS_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tourForm, id: editingTour.id })
      });
      
      if (response.ok) {
        toast.success('Экскурсия обновлена');
        setIsTourDialogOpen(false);
        fetchTours();
        resetTourForm();
        setEditingTour(null);
      }
    } catch (error) {
      toast.error('Ошибка обновления экскурсии');
    }
  };

  const handleDeleteTour = async (id: number) => {
    if (!confirm('Удалить эту экскурсию?')) return;
    
    try {
      const response = await fetch(`${TOURS_API}?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Экскурсия удалена');
        fetchTours();
      }
    } catch (error) {
      toast.error('Ошибка удаления экскурсии');
    }
  };

  const openEditExhibit = (exhibit: Exhibit) => {
    setEditingExhibit(exhibit);
    setExhibitForm({
      title: exhibit.title,
      period: exhibit.period,
      description: exhibit.description,
      image_url: exhibit.image_url,
      category: exhibit.category,
      location: exhibit.location
    });
    setIsExhibitDialogOpen(true);
  };

  const openEditTour = (tour: VirtualTour) => {
    setEditingTour(tour);
    setTourForm({
      title: tour.title,
      description: tour.description,
      duration_minutes: tour.duration_minutes,
      video_url: tour.video_url,
      thumbnail_url: tour.thumbnail_url,
      category: tour.category
    });
    setIsTourDialogOpen(true);
  };

  const resetExhibitForm = () => {
    setExhibitForm({
      title: '',
      period: '',
      description: '',
      image_url: '',
      category: '',
      location: ''
    });
  };

  const resetTourForm = () => {
    setTourForm({
      title: '',
      description: '',
      duration_minutes: 0,
      video_url: '',
      thumbnail_url: '',
      category: ''
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground py-6 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="ShieldCheck" size={32} />
            <h1 className="text-3xl font-bold">Админ-панель музея</h1>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/')}
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            На сайт
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="exhibits" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="exhibits">Экспонаты</TabsTrigger>
            <TabsTrigger value="tours">Экскурсии</TabsTrigger>
          </TabsList>

          <TabsContent value="exhibits">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Управление экспонатами</h2>
              <Button 
                onClick={() => {
                  setEditingExhibit(null);
                  resetExhibitForm();
                  setIsExhibitDialogOpen(true);
                }}
                className="bg-accent hover:bg-accent/90"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить экспонат
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exhibits.map((exhibit) => (
                <Card key={exhibit.id}>
                  <CardHeader>
                    <img 
                      src={exhibit.image_url} 
                      alt={exhibit.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <CardTitle>{exhibit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{exhibit.period}</p>
                    <p className="text-sm mb-4">{exhibit.description}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditExhibit(exhibit)}
                      >
                        <Icon name="Pencil" size={14} className="mr-1" />
                        Изменить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteExhibit(exhibit.id)}
                      >
                        <Icon name="Trash2" size={14} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tours">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Управление экскурсиями</h2>
              <Button 
                onClick={() => {
                  setEditingTour(null);
                  resetTourForm();
                  setIsTourDialogOpen(true);
                }}
                className="bg-accent hover:bg-accent/90"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить экскурсию
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tours.map((tour) => (
                <Card key={tour.id}>
                  <CardHeader>
                    <CardTitle>{tour.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{tour.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {tour.duration_minutes} мин
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Users" size={14} />
                        {tour.viewers_count}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditTour(tour)}
                      >
                        <Icon name="Pencil" size={14} className="mr-1" />
                        Изменить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteTour(tour.id)}
                      >
                        <Icon name="Trash2" size={14} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isExhibitDialogOpen} onOpenChange={setIsExhibitDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExhibit ? 'Редактировать экспонат' : 'Добавить экспонат'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Название</Label>
              <Input 
                id="title"
                value={exhibitForm.title}
                onChange={(e) => setExhibitForm({...exhibitForm, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="period">Период</Label>
              <Input 
                id="period"
                value={exhibitForm.period}
                onChange={(e) => setExhibitForm({...exhibitForm, period: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea 
                id="description"
                value={exhibitForm.description}
                onChange={(e) => setExhibitForm({...exhibitForm, description: e.target.value})}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="image_url">URL изображения</Label>
              <Input 
                id="image_url"
                value={exhibitForm.image_url}
                onChange={(e) => setExhibitForm({...exhibitForm, image_url: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="category">Категория</Label>
              <Input 
                id="category"
                value={exhibitForm.category}
                onChange={(e) => setExhibitForm({...exhibitForm, category: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="location">Местоположение</Label>
              <Input 
                id="location"
                value={exhibitForm.location}
                onChange={(e) => setExhibitForm({...exhibitForm, location: e.target.value})}
              />
            </div>
            <Button 
              className="w-full bg-accent hover:bg-accent/90"
              onClick={editingExhibit ? handleUpdateExhibit : handleCreateExhibit}
            >
              {editingExhibit ? 'Обновить' : 'Создать'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTourDialogOpen} onOpenChange={setIsTourDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTour ? 'Редактировать экскурсию' : 'Добавить экскурсию'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tour_title">Название</Label>
              <Input 
                id="tour_title"
                value={tourForm.title}
                onChange={(e) => setTourForm({...tourForm, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="tour_description">Описание</Label>
              <Textarea 
                id="tour_description"
                value={tourForm.description}
                onChange={(e) => setTourForm({...tourForm, description: e.target.value})}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="duration">Длительность (минуты)</Label>
              <Input 
                id="duration"
                type="number"
                value={tourForm.duration_minutes}
                onChange={(e) => setTourForm({...tourForm, duration_minutes: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="video_url">URL видео</Label>
              <Input 
                id="video_url"
                value={tourForm.video_url}
                onChange={(e) => setTourForm({...tourForm, video_url: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="thumbnail_url">URL превью</Label>
              <Input 
                id="thumbnail_url"
                value={tourForm.thumbnail_url}
                onChange={(e) => setTourForm({...tourForm, thumbnail_url: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="tour_category">Категория</Label>
              <Input 
                id="tour_category"
                value={tourForm.category}
                onChange={(e) => setTourForm({...tourForm, category: e.target.value})}
              />
            </div>
            <Button 
              className="w-full bg-accent hover:bg-accent/90"
              onClick={editingTour ? handleUpdateTour : handleCreateTour}
            >
              {editingTour ? 'Обновить' : 'Создать'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
