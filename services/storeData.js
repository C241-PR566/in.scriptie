import { Firestore } from '@google-cloud/firestore';

async function storeData(collection, id, data) {
    const db = new Firestore();
    const collectionRef = db.collection(collection);
    return collectionRef.doc(id).set(data);
}

export default storeData;
