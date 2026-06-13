const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { winner, options, is_custom = true, user_id = null } = body;

    if (!winner || !options || !Array.isArray(options)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Winner and options array are required' })
      };
    }

    const dbUrl = process.env.DATABASE_URL;
    let savedInDb = false;
    let record = null;

    if (dbUrl) {
      try {
        const sql = neon(dbUrl);
        // Create tables if they do not exist (simple migration support for demo purposes)
        try {
          await sql`
            CREATE TABLE IF NOT EXISTS users (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              email VARCHAR(255) UNIQUE NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
          `;
          await sql`
            CREATE TABLE IF NOT EXISTS decisions (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID,
              winner_title VARCHAR(255) NOT NULL,
              options JSONB NOT NULL,
              is_custom BOOLEAN DEFAULT TRUE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
          `;
        } catch (migErr) {
          console.warn("Table auto-creation skipped or failed:", migErr.message);
        }

        // Insert decision
        const result = await sql`
          INSERT INTO decisions (winner_title, options, is_custom, user_id)
          VALUES (${winner}, ${JSON.stringify(options)}, ${is_custom}, ${user_id})
          RETURNING id, winner_title, options, is_custom, created_at
        `;
        
        if (result && result[0]) {
          record = result[0];
          savedInDb = true;
        }
      } catch (dbErr) {
        console.error("Neon DB storage error, continuing with local logging fallback:", dbErr.message);
      }
    }

    if (!savedInDb) {
      console.log(`[DecidiJá Mock Storage] Decision logged: Winner "${winner}" chosen from [${options.join(', ')}]. Custom wheel: ${is_custom}.`);
      record = {
        id: "mock-" + Math.random().toString(36).substr(2, 9),
        winner_title: winner,
        options: options,
        is_custom: is_custom,
        created_at: new Date().toISOString()
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        savedInDb,
        data: record
      })
    };

  } catch (error) {
    console.error("Endpoint decide error:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
