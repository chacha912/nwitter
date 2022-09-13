import { useEffect, useState } from 'react';
import { dbService, collection, addDoc, getDocs } from 'fbase';

const Home = () => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(dbService, 'nweets'), {
        text: nweet,
        createdAt: Date.now(),
      });
      setNweet('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const getNweets = async () => {
    const querySnapshot = await getDocs(collection(dbService, 'nweets'));
    querySnapshot.forEach((doc) => {
      const nweetObject = { ...doc.data(), id: doc.id };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };

  useEffect(() => {
    getNweets();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type='text' placeholder="What's on your mind?" maxLength={120} />
        <button type='submit'>Nweet</button>
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h2>{nweet.text}</h2>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
