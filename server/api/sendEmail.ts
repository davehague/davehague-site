// server/api/sendEmail.ts
import { defineEventHandler, readBody } from 'h3'
import Mailjet from 'node-mailjet'

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, email, message } = body

    try {
        const request = await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'dave@promptblocks.app',
                        Name: 'David Hague',
                    },
                    To: [
                        {
                            Email: 'david.hague@gmail.com',
                            Name: 'David Hague',
                        },
                    ],
                    Subject: 'New Contact Form Submission',
                    HTMLPart: `
                        <h3>New contact form submission</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Message:</strong> ${message}</p>
                    `,
                },
            ],
        })

        return {
            success: true,
            message: 'Email sent successfully',
        }
    } catch (error) {
        console.error('Failed to send email with error:', error instanceof Error ? error.message : error)
        return {
            success: false,
            message: 'Failed to send email',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
})