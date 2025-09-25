import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { quickPrompts } from '../components/quickOptions';

/**
 * Seeds the 'styles' collection in Firestore with data from quickOptions.ts.
 * It checks for existing styles by name to avoid creating duplicates.
 * @returns {Promise<string>} A promise that resolves to a summary message of the operation.
 */
export const seedInspirationStyles = async (): Promise<string> => {
    console.log("Starting to seed Firestore...");
    const stylesCollectionRef = collection(db, 'styles');
    let addedCount = 0;
    let skippedCount = 0;

    try {
        // Use Promise.all to run checks concurrently for better performance
        await Promise.all(quickPrompts.map(async (style) => {
            // Check if a style with the same name already exists
            const q = query(stylesCollectionRef, where("name", "==", style.name));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // If no document with the same name exists, add it
                await addDoc(stylesCollectionRef, {
                    name: style.name,
                    prompt: style.prompt,
                    imageUrl: style.imageUrl,
                    category: style.category,
                });
                console.log(`Added style: "${style.name}"`);
                addedCount++;
            } else {
                // If it exists, skip it
                console.log(`Skipped style (already exists): "${style.name}"`);
                skippedCount++;
            }
        }));

        const message = `Seeding complete. Added: ${addedCount} new styles. Skipped: ${skippedCount} existing styles.`;
        console.log(message);
        return message;

    } catch (error: any) {
        console.error("Error seeding Firestore:", error);
        
        // Check for specific Firebase permission error
        if (error.code === 'permission-denied') {
            throw new Error(
                "Akses Ditolak oleh Aturan Firestore. Buka Firebase Console > Firestore > Aturan (Rules), lalu izinkan 'write' untuk sementara agar bisa menyimpan data contoh."
            );
        }
        
        if (error instanceof Error) {
            throw new Error(`Gagal menyimpan data: ${error.message}. Cek aturan Firestore dan koneksi internet.`);
        }
        throw new Error("Terjadi kesalahan yang tidak diketahui saat seeding.");
    }
};
