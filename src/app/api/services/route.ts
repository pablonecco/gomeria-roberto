import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/services.json');
const STORE_NAME = 'gomeria-services';
const BLOB_KEY = 'services';

// Detect production: Netlify sets CONTEXT to "production" or "deploy-preview"
// Also check if we can't write to filesystem (serverless)
const isProduction = process.env.CONTEXT === 'production' ||
    process.env.CONTEXT === 'deploy-preview' ||
    process.env.NETLIFY === 'true';

async function getServices() {
    if (isProduction) {
        // Use Netlify Blobs in production
        try {
            const store = getStore(STORE_NAME);
            const data = await store.get(BLOB_KEY, { type: 'json' });
            console.log('[BLOBS] Read services:', data ? `${data.length} items` : 'empty');
            return data || [];
        } catch (error) {
            console.error('[BLOBS] Error reading:', error);
            return [];
        }
    } else {
        // Use JSON file in development
        try {
            if (!fs.existsSync(dataFilePath)) {
                console.log('[LOCAL] No services file, returning empty array');
                return [];
            }
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            const data = JSON.parse(fileData);
            console.log('[LOCAL] Read services:', data.length, 'items');
            return data;
        } catch (error) {
            console.error('[LOCAL] Error reading:', error);
            return [];
        }
    }
}

async function saveServices(services: any[]) {
    if (isProduction) {
        // Save to Netlify Blobs in production
        try {
            const store = getStore(STORE_NAME);
            await store.setJSON(BLOB_KEY, services);
            console.log('[BLOBS] Saved', services.length, 'services');
        } catch (error) {
            console.error('[BLOBS] Error writing:', error);
            throw error;
        }
    } else {
        // Save to JSON file in development
        try {
            fs.writeFileSync(dataFilePath, JSON.stringify(services, null, 2));
            console.log('[LOCAL] Saved', services.length, 'services to file');
        } catch (error) {
            console.error('[LOCAL] Error writing:', error);
            throw error;
        }
    }
}

async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.has('admin_token');
}

export async function GET() {
    try {
        console.log('[GET] Environment check - isProduction:', isProduction);
        const services = await getServices();
        return NextResponse.json(services);
    } catch (error) {
        console.error('[GET] Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch services',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        console.log('[POST] Environment check - isProduction:', isProduction);
        const newService = await request.json();
        const services = await getServices();

        newService.id = Date.now().toString();
        services.push(newService);
        await saveServices(services);

        return NextResponse.json(newService);
    } catch (error) {
        console.error('[POST] Error:', error);
        return NextResponse.json({
            error: 'Failed to add service',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        console.log('[PUT] Environment check - isProduction:', isProduction);
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
        console.error('[PUT] Error:', error);
        return NextResponse.json({
            error: 'Failed to update service',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        console.log('[DELETE] Environment check - isProduction:', isProduction);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        let services = await getServices();
        console.log('[DELETE] Before:', services.length, 'services');
        services = services.filter((s: any) => s.id !== id);
        console.log('[DELETE] After:', services.length, 'services');
        await saveServices(services);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[DELETE] Error:', error);
        return NextResponse.json({
            error: 'Failed to delete service',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
