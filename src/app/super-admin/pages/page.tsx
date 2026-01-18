'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
    Loader2, Save, Plus, FileText, Pencil, Trash2, Globe, Eye, MoreVertical
} from 'lucide-react';
import { collection, doc, getDocs, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { generateSlug } from '@/lib/slug';

interface StaticPage {
    id: string;
    title: string;
    slug: string;
    content: string;
    description?: string;
    lastUpdated: Timestamp;
    published: boolean;
}

export default function StaticPagesDashboard() {
    const [pages, setPages] = useState<StaticPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form Stats
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        content: '',
        published: true
    });

    const fetchPages = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(firestore, 'pages'));
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as StaticPage));
            setPages(data);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch pages' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleCreateNew = () => {
        setEditingPage(null);
        setFormData({ title: '', slug: '', description: '', content: '', published: true });
        setIsDialogOpen(true);
    };

    const handleEdit = (page: StaticPage) => {
        setEditingPage(page);
        setFormData({
            title: page.title,
            slug: page.slug,
            description: page.description || '',
            content: page.content,
            published: page.published
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.slug) {
            toast({ variant: 'destructive', title: 'Validation Error', description: 'Title and Slug are required.' });
            return;
        }

        setSaving(true);
        try {
            const slug = generateSlug(formData.slug); // Ensure clean slug
            const pageData = {
                title: formData.title,
                slug,
                description: formData.description,
                content: formData.content,
                published: formData.published,
                lastUpdated: Timestamp.now()
            };

            const docId = editingPage ? editingPage.id : slug; // Use slug as ID for simplicity or auto-id

            await setDoc(doc(firestore, 'pages', docId), pageData, { merge: true });

            toast({ title: 'Success', description: 'Page saved successfully.' });
            setIsDialogOpen(false);
            fetchPages();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save page.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page?')) return;
        try {
            await deleteDoc(doc(firestore, 'pages', id));
            toast({ title: 'Deleted', description: 'Page removed.' });
            fetchPages();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete data.' });
        }
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Static Pages</h1>
                    <p className="text-zinc-400">Manage legal, about, and information pages.</p>
                </div>
                <Button onClick={handleCreateNew} className="bg-gold text-obsidian font-bold hover:bg-gold/90 h-11 px-6 gap-2">
                    <Plus className="h-4 w-4" /> Create Page
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                    <Card key={page.id} className="bg-[#111] border-white/5 hover:border-gold/30 transition-all group">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white group-hover:text-gold transition-colors">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base text-white">{page.title}</CardTitle>
                                    <CardDescription className="text-xs">/{page.slug}</CardDescription>
                                </div>
                            </div>
                            <Badge variant={page.published ? 'default' : 'secondary'} className={page.published ? 'bg-green-500/10 text-green-500' : ''}>
                                {page.published ? 'Live' : 'Draft'}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-500 line-clamp-2 min-h-[2.5em]">{page.description || 'No description provided.'}</p>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                                <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
                                    {page.lastUpdated?.toDate().toLocaleDateString()}
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-gold" onClick={() => window.open(`/pages/${page.slug}`, '_blank')}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400" onClick={() => handleEdit(page)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400" onClick={() => handleDelete(page.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {pages.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-2xl">
                        No pages found. Create one to get started.
                    </div>
                )}
            </div>

            {/* Editor Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#111] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingPage ? 'Edit Page' : 'Create New Page'}</DialogTitle>
                        <DialogDescription>Content supports basic HTML/Markdown depending on your frontend implementation.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Page Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                                    placeholder="e.g. Terms of Service"
                                    className="bg-black/50 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug (URL Path)</Label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="terms-of-service"
                                    className="bg-black/50 border-white/10 font-mono text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description (SEO)</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-black/50 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Page Content</Label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="bg-black/50 border-white/10 min-h-[300px] font-mono text-sm leading-relaxed"
                                placeholder="# Page Heading..."
                            />
                            <p className="text-xs text-zinc-500 text-right">Supports raw HTML or Markdown</p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-gold text-obsidian font-bold">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
