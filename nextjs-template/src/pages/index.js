import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [shippedItems, setShippedItems] = useState([]);

  // Fetch roadmap items
  useEffect(() => {
    fetch("/api/roadmap")
      .then((response) => response.json())
      .then((data) => setRoadmapItems(data.roadmapItems));
  }, []);
  // Fetch recently shipped items
  useEffect(() => {
    fetch("/api/roadmap")
      .then((response) => response.json())
      .then((data) => setShippedItems(data.shippedItems));
  }, []);

  const handleUpvote = (id, column, clicked_id) => {
    fetch("/api/upvote", {
      method: "POST",
      body: JSON.stringify({ id , column}),
      headers: {
        "Content-Type": "application/json",
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const updateItems = (items) => items.map((item) => {
          if (item.id === data.id) {
              return { ...item, upvotes: data.upvotes, fires: data.fires, hearts: data.hearts};
          }
          return item;
      }); 
      const updatedRoadmapItems = updateItems(roadmapItems);
      setRoadmapItems(updatedRoadmapItems);
      const updatedShippedItems = updateItems(shippedItems);
      setShippedItems(updatedShippedItems);            
        document.getElementById(clicked_id).disabled = true;
      });
  };

  return (
    <>
      <Head>
        <title>Codesphere Roadmap</title>
        
      </Head>
      <main>
        <div className="roadmap">
        <div className="header">
              <img className="logo"  src="/logo-codesphere.png" alt="Company Logo"></img>
              <div>
                <div className="headline">Codesphere Roadmap</div>
                <div className="subheadline">See what&apos;s happening & what&apos;s next</div>
              </div>
        </div> 
        <h2>Cooming soon</h2> 
        <p>Missing something? Suggest features <a href="https://feedback.codesphere.com/">here</a>!</p>      
        <div>
          {roadmapItems.map((item) => (
            <div key={item.id} className="feature">
              <p className="ribbon blue">{item.month}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="voting-array">
                <button
                  id={"upvote_"+item.id}
                  className="upvote-button"
                  onClick={() => handleUpvote(item.id, 'upvotes', 'upvote_'+item.id)}
                >
                  👍 {item.upvotes}
                </button>
                <button
                  id={"fire_"+item.id}
                  className="upvote-button"
                  onClick={() => handleUpvote(item.id, 'fires', 'fire_'+item.id)}
                >
                  🔥 {item.fires}
                </button>
                <button
                  id={"heart_"+item.id}
                  className="upvote-button"
                  onClick={() => handleUpvote(item.id, 'hearts', 'heart_'+item.id)}
                >
                  💜 {item.hearts}
                </button>
              </div>
            </div>
          ))}
        </div>
        <h2>Recently released</h2>  

        <div className="released">
          {shippedItems.map((item) => (
            <div key={item.id} className="feature">
              <p className="ribbon">Shipped</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="voting-array">
                <button
                  id={"upvote_"+item.id}
                  className="upvote-button"
                  onClick={() => handleUpvote(item.id, 'upvotes', 'upvote_'+item.id)}
                >
                  👍 {item.upvotes}
                </button>
                <button
                  id={"fire_"+item.id}
                  className="upvote-button"
                  onClick={() => handleUpvote(item.id, 'fires', 'fire_'+item.id)}
                >
                  🔥 {item.fires}
                </button>
                <button
                  id={"heart_"+item.id}
                  className="upvote-button"
                  onClick={() => handleUpvote(item.id, 'hearts', 'heart_'+item.id)}
                >
                  💜 {item.hearts}
                </button>
              </div>
            </div>
          ))}
        <div className="backgroundBlur1"></div>
        <div className="backgroundBlur2"></div>
        </div>

        </div>
      </main>
    </>
  );
}
