
import React from 'react';
import { Trail } from '../../types/trail';
import { useLanguage } from '../../context/LanguageContext';

interface TrailDescriptionProps {
  trail: Trail;
  truncate?: boolean;
}

const TrailDescription: React.FC<TrailDescriptionProps> = ({ 
  trail, 
  truncate = false 
}) => {
  const { language } = useLanguage();

  const getDescription = (trail: Trail, lang: string) => {
    if (trail.name === "Refugio Frey from Villa Catedral") {
      switch(lang) {
        case 'en':
          return "We recommend taking an Uber from Camping to the base of Cerro Catedral. The trip takes approximately 15 minutes. Buses often involve a long wait. This trail starts at a higher point than the one from Lake Gutiérrez, saving about 1 hour of hiking. From the base of Cerro Catedral, you can begin your ascent to Refugio Frey, enjoying spectacular views as you progress through the mountainous landscape. The effort is truly worth it when you reach the panoramic views of Lake Gutiérrez, Bariloche, and the valley that extends to the summit of Frey, an impressive landscape that rewards every step of the ascent.";
        case 'es':
          return "Recomendamos tomarse un Uber desde el Camping hasta la base del Cerro Catedral. El viaje dura aproximadamente 15 minutos. Los buses muchas veces presentan una gran espera. Este sendero comienza en un punto más alto que el que parte desde el Lago Gutiérrez, lo que permite ahorrar alrededor de 1 hora de caminata. Desde la base del Cerro Catedral, podrás iniciar el ascenso al Refugio Frey, disfrutando de vistas espectaculares mientras avanzas a través del paisaje montañoso. El esfuerzo realmente vale la pena al llegar a las vistas panorámicas del Lago Gutiérrez, Bariloche y el valle que se extiende hasta la cumbre del Frey, un paisaje impresionante que recompensa cada paso del ascenso.";
        default:
          return trail.description[lang as keyof typeof trail.description] || "";
      }
    }
    if (trail.name === "Cerro Otto & Piedra de Habsburgo") {
      switch(lang) {
        case 'en':
          return "To reach Cerro Otto from Camping Los Coihues, you can take bus 50 on the main avenue and get off at the stop near the Lower Cable Car Station, at kilometer 5 of Avenida de los Pioneros. From there, you can go up by cable car or walk to the summit. If you go by car, follow Route 82 and then take Avenida de los Pioneros to the cable car access, where you can leave the vehicle or continue to the summit along the gravel road.\n\nThe trail starts from the vacant lot right across from La Anónima supermarket at km 4 of Av. Pioneros. You can also start from José Ingenieros street.\n\nFrom there, you'll climb up a bike descent track until you reach an area with houses and fences.\n\nThere you'll pass through an alley between two house fences. After a few meters, you'll reach a street and cross it to continue on the trail. Everything is marked with signs and red paint.\n\nFrom there it's all trail, without houses. You'll gain elevation and begin to have views of the lake and the Melipal neighborhood.\n\nWhen you reach the end, there's a wide path where, after a few hundred meters, you'll arrive at the access trail to the Berghof refuge and the Otto Meiling museum.\n\nPassing this area, you'll reach the Nordic ski club and continue along the road to the confectionery.";
        case 'es':
          return "Para llegar al Cerro Otto desde Camping Los Coihues, puedes tomar el colectivo 50 en la avenida principal y bajarte en la parada cercana a la Estación Inferior del Teleférico, en el kilómetro 5 de la Avenida de los Pioneros. Desde allí, puedes subir en teleférico o hacer la caminata hasta la cumbre. Si vas en auto, sigue la Ruta 82 y luego toma la Avenida de los Pioneros hasta el acceso al teleférico, donde puedes dejar el vehículo o continuar hasta la cumbre por el camino de ripio.\n\nEl sendero comienza desde el baldío que está justo enfrente del supermercado La Anónima en el km. 4 de Av. Pioneros. También se puede comenzar por la calle José Ingenieros.\n\nDe allí se va subiendo por una pista de descenso de bicis, hasta llegar a una zona de casas, con alambrados.\n\nAhí se pasa por un callejón entre dos alambrados de casas. A unos metros se llega a una calle y se cruza para seguir la picada. Está todo señalizado con carteles y pintura roja.\n\nA partir de ahí es todo sendero, sin casas. Se va ganando altura y se comienza a tener visual del lago y el barrio Melipal.\n\nAl llegar al final, hay un sendero amplio, por donde, después de unos cientos de metros, se llega al sendero de acceso al refugio Berghof y al museo de Otto Meiling.\n\nPasando esta zona, se llega al club de esquí nórdico y seguimos por la calle hasta la confitería.";
        default:
          return trail.description[lang as keyof typeof trail.description] || "";
      }
    }
    return trail.description[lang as keyof typeof trail.description] || "";
  };

  const description = getDescription(trail, language);

  return (
    <p 
      className={
        truncate 
          ? "text-sm text-gray-600 line-clamp-2" 
          : "text-gray-600 whitespace-pre-line"
      }
    >
      {description}
    </p>
  );
};

export default TrailDescription;
