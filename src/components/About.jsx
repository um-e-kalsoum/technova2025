import arzow from "../assets/arzow.jpg";
import kalsoum from "../assets/kalsoum.jpg";
import amina from "../assets/amina.jpg"; 
import maham from "../assets/maham.jpg"; 

export const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 text-black dark:text-white"
    >
      <div className="glass-box bg-white/70 dark:bg-[#1e1e2f]/70 p-8">
        <h2 className="text-4xl font-bold mb-8">About Our Team</h2>

        {/* team pics */}
        <div className="flex flex-wrap justify-center gap-12">

          {/* arzow */}
          <div className="flex flex-col items-center max-w-xs">
            <img
              src={arzow}
              alt="Arzow"
              className="w-40 h-40 rounded-lg object-cover mb-4"
            />
            <p className="text-lg font-semibold">Arzow</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              2nd year software engineering student at University of Guelph
            </p>
          </div>

          {/* kalsoum */}
          <div className="flex flex-col items-center max-w-xs">
            <img
              src={kalsoum}
              alt="Kalsoum"
              className="w-40 h-40 rounded-lg object-cover mb-4"
            />
            <p className="text-lg font-semibold">Kalsoum</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              2nd year computer science student at University of Guelph
            </p>
          </div>

          {/* amina */}
          <div className="flex flex-col items-center max-w-xs">
            <img
              src={amina}
              alt="Amina"
              className="w-40 h-40 rounded-lg object-cover mb-4"/>
            <p className="text-lg font-semibold">Amina</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              2nd year software engineering student at University of Guelph
            </p>
          </div>

          {/* maham */}
          <div className="flex flex-col items-center max-w-xs">
            <img
              src={maham}
              alt="Maham"
              className="w-40 h-40 rounded-lg object-cover mb-4"/>
            <p className="text-lg font-semibold">Maham</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              2nd year computer science student at University of Guelph
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};