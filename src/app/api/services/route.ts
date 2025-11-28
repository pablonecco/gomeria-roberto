import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/services.json');
const STORE_NAME = 'gomeria-services';
const BLOB_KEY = 'services';

async function getServices() {
    // Try Netlify Blobs first (production/serverless)
    try {
        const store = getStore(STORE_NAME);
        const data = await store.get(BLOB_KEY, { type: 'json' });
        console.log('[BLOBS] Successfully read:', data ? `${data.length} services` : 'empty');
        return data || [];
    } catch (blobError) {
        // Blobs failed, try local file (development)
        console.log('[BLOBS] Not available, using local file');
        try {
            if (!fs.existsSync(dataFilePath)) {
                console.log('[LOCAL] File not found, returning empty array');
                return [];
            }
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            const data = JSON.parse(fileData);
            console.log('[LOCAL] Read', data.length, 'services from file');
            return data;
        } catch (fileError) {
            console.error('[LOCAL] File read failed:', fileError);
            return [];
        }
    }
}

async function saveServices(services: any[]) {
    // Try Netlify Blobs first (production/serverless)
    try {
        const store = getStore(STORE_NAME);
        await store.setJSON(BLOB_KEY, services);
        console.log('[BLOBS] Successfully saved', services.length, 'services');
        return; // Success, exit
    } catch (blobError) {
        // Blobs failed, try local file (development)
        console.log('[BLOBS] Not available, using local file');
        try {
            fs.writeFileSync(dataFilePath, JSON.stringify(services, null, 2));
            console.log('[LOCAL] Saved', services.length, 'services to file');
        } catch (fileError) {
            console.error('[LOCAL] File write failed:', fileError);
            throw new Error('Cannot save data: both Blobs and file system failed');
        }
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
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        let services = await getServices();
        console.log('[DELETE] Before filter:', services.length, 'services');
        services = services.filter((s: any) => s.id !== id);
        console.log('[DELETE] After filter:', services.length, 'services');
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
