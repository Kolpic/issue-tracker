import { issueSchema, patchIssueSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth'
import authOptions from '@/app/auth/authOptions'
import { User } from "@prisma/client";

export async function PATCH(request: NextRequest, {params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({}, {status: 401});
    }
    
    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    const {id}  = await params;

    let {assignedToUserId, title, description} = body;
    if (assignedToUserId) {
        let user;
        if (assignedToUserId === 'null') {
            assignedToUserId = null;
        } else {
            user = await prisma.user.findUnique({where: {id: assignedToUserId}})
            if (!user) {
                return NextResponse.json({ error: 'Invalid user.'}, {status: 400});
            }
        }
    }

    const issue = await prisma.issue.findUnique({
        where: {id: parseInt(id)} 
    });
    
    if (!issue) {
        return NextResponse.json({error: "Issue not found"}, {status: 404});
    }

    const updateIssue = await prisma.issue.update({
        where: {id: issue.id},
        data: {
            title,
            description,
            assignedToUserId
        }
    });
    return NextResponse.json(updateIssue);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string}}
){
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({}, {status: 401});
    }
    
    const issue = await prisma.issue.findUnique({
        where: {id: parseInt(params.id)}
    })

    if (!issue) {
        return NextResponse.json({error: "Invalid issue"}, { status:404 });
    }

    await prisma.issue.delete({
        where: {id: issue.id}
    });

    return NextResponse.json({});
}