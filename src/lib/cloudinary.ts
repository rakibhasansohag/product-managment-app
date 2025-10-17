export async function uploadToCloudinary(file: File) {
	const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
	const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
	if (!cloudName || !preset) throw new Error('Missing Cloudinary env vars');

	const fd = new FormData();
	fd.append('file', file);
	fd.append('upload_preset', preset);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
		{
			method: 'POST',
			body: fd,
		},
	);
	if (!res.ok) throw new Error('Cloudinary upload failed');
	const json = await res.json();
	return json.secure_url as string;
}
