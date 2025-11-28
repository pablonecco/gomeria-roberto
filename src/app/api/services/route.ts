import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const dataFilePath = path.join(process.cwd(), 'src/data/services.json');

function getServices() {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData);
}

function saveServices(services: any[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(services, null, 2));
}

async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.has('admin_token');
}

export async function GET() {
    try {
        const services = getServices();
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const newService = await request.json();
        const services = getServices();

        // Simple ID generation
        newService.id = Date.now().toString();

        services.push(newService);
        saveServices(services);

        return NextResponse.json(newService);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const updatedService = await request.json();
        const services = getServices();

        const index = services.findIndex((s: any) => s.id === updatedService.id);
        if (index !== -1) {
            services[index] = updatedService;
            saveServices(services);
            return NextResponse.json(updatedService);
        }

        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    } catch (error) {
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

        let services = getServices();
        services = services.filter((s: any) => s.id !== id);
        saveServices(services);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
