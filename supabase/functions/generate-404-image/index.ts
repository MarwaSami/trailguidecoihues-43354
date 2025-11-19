import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userType } = await req.json();
    
    const prompts = {
      freelancer: "Create a friendly, colorful cartoon illustration of a confused freelancer character sitting at a desk with a laptop, looking at a '404' error on screen. The character should be wearing casual clothes, have a puzzled but friendly expression, surrounded by floating code symbols and question marks. Cute, modern flat design style with vibrant colors like blues, purples, and oranges. The background should have abstract geometric shapes and tech elements.",
      client: "Create a friendly, colorful cartoon illustration of a professional client character in business casual attire, holding a briefcase, looking at a map or compass that shows '404'. The character should have a curious, friendly expression. Include floating icons of projects, documents, and team symbols around them. Cute, modern flat design style with vibrant colors like teals, greens, and yellows. The background should have office and collaboration elements with abstract shapes."
    };

    const prompt = prompts[userType as keyof typeof prompts] || prompts.freelancer;

    console.log('Generating 404 image for:', userType);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image generated');
    }

    console.log('Image generated successfully');

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
