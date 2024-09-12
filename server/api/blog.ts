import { defineEventHandler, readBody, getQuery } from 'h3'
import { supabase } from '~/utils/supabaseClient'
import { BlogPost } from '~/types/interfaces'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    const query = getQuery(event)
    const slug = query.slug as string

    const getSlugs = query.getSlugs === 'true'

    if (getSlugs) {
      const { data, error } = await supabase
        .from('blogs')
        .select('slug')
  
      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Error fetching blog slugs',
        })
      }
  
      return data.map(item => item.slug)
    }
  

    if (!slug) {
      // If no slug is provided, return all blog posts
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Error fetching blog posts',
        })
      }

      return data as BlogPost[]
    }

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found',
      })
    }

    return data as BlogPost
  } else if (method === 'POST') {
    const body = await readBody(event)
    const { title, slug, excerpt, content, password } = body

    if (password !== process.env.ADMIN_TOKEN) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, slug, excerpt, content }])
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error creating blog post',
      })
    }

    return data as BlogPost
  } else if (method === 'PUT') {
    const query = getQuery(event)
    const slug = query.slug as string
    const body = await readBody(event)
    const { title, newSlug, excerpt, content, password } = body

    if (password !== process.env.ADMIN_TOKEN) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    const { data, error } = await supabase
      .from('blogs')
      .update({ title, slug: newSlug, excerpt, content })
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error updating blog post',
      })
    }

    return data as BlogPost
  } else if (method === 'DELETE') {
    const query = getQuery(event)
    const slug = query.slug as string
    const body = await readBody(event)
    const { password } = body

    if (password !== process.env.ADMIN_TOKEN) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('slug', slug)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error deleting blog post',
      })
    }

    return { message: 'Blog post deleted successfully' }
  } else {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    })
  }
})