// GIAI ĐOẠN 1 - CHỈ XEM CẤU TRÚC DỮ LIỆU
// Hàm này nhận webhook từ Pancake POS và chỉ ghi vào nhật ký TÊN CÁC TRƯỜNG và KIỂU DỮ LIỆU,
// không ghi giá trị (tên, số điện thoại, địa chỉ khách sẽ không bị ghi lại).

const shape = (v, d = 0) => {
  if (v === null) return 'null';
  if (Array.isArray(v)) return v.length ? ['array(' + v.length + ') of', shape(v[0], d + 1)] : 'array(0)';
  if (typeof v === 'object') {
    if (d > 6) return 'object';
    const o = {};
    for (const k of Object.keys(v)) o[k] = shape(v[k], d + 1);
    return o;
  }
  if (typeof v === 'string') return 'string(' + v.length + ')';
  return typeof v;
};

export default async (req) => {
  if (req.method !== 'POST') return new Response('ok', { status: 200 });

  const secret = Netlify.env.get('PANCAKE_WEBHOOK_SECRET');
  if (!secret || req.headers.get('x-pancake-secret') !== secret) {
    return new Response('unauthorized', { status: 401 });
  }

  const raw = await req.text();
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    console.log('PANCAKE_NONJSON content-type=' + (req.headers.get('content-type') || '') + ' length=' + raw.length);
    return new Response('ok', { status: 200 });
  }
  console.log('PANCAKE_SHAPE ' + JSON.stringify(shape(body)));
  return new Response('ok', { status: 200 });
};

export const config = { path: '/api/pancake-webhook' };
