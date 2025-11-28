import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/services.json');
const STORE_NAME = 'gomeria-services';
const BLOB_KEY = 'services';

// Helper to check if we're in production (Netlify)
const isProduction = process.env.NETLIFY === 'true';

async function getServices() {
    if (isProduction) {
        // Use Netlify Blobs in production
        try {
            const store = getStore(STORE_NAME);
            const data = await store.get(BLOB_KEY, { type: 'json' });
            return data || [];
        } catch (error) {
            console.error('Error reading from Netlify Blobs:', error);
            return [];
        }
    } else {
        // Use JSON file in development
        if (!fs.existsSync(dataFilePath)) {
            return [];
        }
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(fileData);
    }
}

async function saveServices(services: any[]) {
    if (isProduction) {
        // Save to Netlify Blobs in production
        try {
            const store = getStore(STORE_NAME);
            await store.setJSON(BLOB_KEY, services);
        } catch (error) {
            console.error('Error writing to Netlify Blobs:', error);
            throw error;
        }
    } else {
        // Save to JSON file in development
        fs.writeFileSync(dataFilePath, JSON.stringify(services, null, 2));
    }
}

async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.has('admin_token');
}

export async function GET() {
    try {
        const services = await getServices();
        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const newService = await request.json();
        const services = await getServices();

        // Simple ID generation
        newService.id = Date.now().toString();

        services.push(newService);
        await saveServices(services);

        return NextResponse.json(newService);
    } catch (error) {
        console.error('Error adding service:', error);
        return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const updatedService = await request.json();
        const services = await getServices();

        const index = services.findIndex((s: any) => s.id === updatedService.id);
        if (index !== -1) {
            services[index] = updatedService;
            await saveServices(services);
            return NextResponse.json(updatedService);
        }

        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        let services = await getServices();
        services = services.filter((s: any) => s.id !== id);
        await saveServices(services);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
