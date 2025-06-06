export default function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
        const { name, email } = req.body;

        // Perform your logic here, e.g., save data to a database

        res.status(200).json({ message: 'Data received', data: { name, email } });
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}