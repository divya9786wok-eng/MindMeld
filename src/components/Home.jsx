import React from "react";
import Card from "./Card";
import ImageCard from "./ImageCard";
import focus from "../assets/focusimg.png";
import memory from "../assets/memory.jpg";
import conc from "../assets/conc.jpg";
import memorylogo from "../assets/memorylogo.svg";
import focuslogo from "../assets/focuslogo.svg";
import attention from "../assets/attention.svg";
import { useSelector } from "react-redux";
import FirstHome from "./FirstHome";
const Home = () => {
  const user = useSelector((state) => state.user.user);
  const cnt = user?.Category?.reduce(
    (total, category) => total + category.count,
    0
  );

  return (
    <div>
      {user && cnt === 0 ? (
        <FirstHome />
      ) : (
        <div className="p-8 bg-gray-50 min-h-screen px-32">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Recommended tasks</h2>
            <p className="text-gray-600 mb-8">
              Play these games to improve upon your weaker parts
            </p>
            <div className="grid grid-cols-1 min-h-[20px] md:grid-cols-2 lg:grid-cols-3 gap-16">
              <Card
                category="Focus"
                title="Dual N-Block Test"
                difficulty="Hard"
                description="30 mins"
                logo={focuslogo}
                image="/path/to/image.jpg"
                link="/2-back-test"
              />
              <Card
                category="Focus"
                title="Shape-color matching"
                difficulty="Medium"
                description="30 mins"
                logo={focuslogo}
                image="/path/to/image.jpg"
                link="/shape-color-matching"
              />
              <Card
                category="Attention"
                title="Stroop Test"
                difficulty="Medium"
                description="30 mins"
                logo={attention}
                image="/path/to/image.jpg"
                link="/stroop-test"
              />
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Recommended activities</h2>
            <p className="text-gray-600 mb-8">
              Ranging from physical activities to diet additions, try these out
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              <Card
                category="Focus"
                title="DHA (omega-3 fatty acid)"
                description="Supports brain development and memory."
                logo={focuslogo}
              />
              <Card
                category="Memory"
                title="8 to 10 hours of sleep"
                description="Consolidate learning and memory."
                logo={memorylogo}
              />
              <Card
                category="Attention"
                title="Physical Exercise"
                description="Enhance hippocampal function."
              />
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Customized Plans</h2>
            <p className="text-gray-600 mb-8">There's something for everyone</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              <ImageCard
                category="Focus"
                title="10 days to 10x focus program"
                logo={focuslogo}
                image={focus}
              />
              <ImageCard
                category="Memory"
                title="Memory master series"
                logo={memorylogo}
                image={memory}
              />
              <ImageCard
                category="Attention"
                title="Attention span 200"
                logo={attention}
                image={conc}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
