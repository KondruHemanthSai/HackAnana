export interface BusStop {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

// Data from iotakodali/hyd-bus-data/master/stops_id.csv (Major Hubs subset)
export const HYD_BUS_STOPS: BusStop[] = [
    { id: "348", name: "Koti", lat: 17.38471, lng: 78.48426 },
    { id: "301", name: "Abids GPO", lat: 17.38781, lng: 78.47613 },
    { id: "304", name: "Lakdikapool", lat: 17.40322, lng: 78.46536 },
    { id: "306", name: "Masab Tank", lat: 17.40429, lng: 78.45185 },
    { id: "308", name: "Banjara Hills Road No 12", lat: 17.40821, lng: 78.43877 },
    { id: "334", name: "Jubilee Hills Checkpost", lat: 17.42869, lng: 78.41307 },
    { id: "319", name: "Hitech Shilparamam", lat: 17.45238, lng: 78.38021 },
    { id: "323", name: "Kondapur", lat: 17.46498, lng: 78.36409 },
    { id: "398", name: "Lingampally", lat: 17.495, lng: 78.31592 },
    { id: "1061", name: "HCU Depot", lat: 17.46875, lng: 78.3311 },
    { id: "1064", name: "Gachibowli Stadium", lat: 17.45163, lng: 78.34518 },
    { id: "911", name: "IIIT", lat: 17.44493, lng: 78.35318 },
    { id: "915", name: "Gachibowli X Road", lat: 17.43836, lng: 78.36443 },
    { id: "802", name: "Tolichowki", lat: 17.39863, lng: 78.41693 },
    { id: "804", name: "Mehdipatnam", lat: 17.39505, lng: 78.44017 },
    { id: "1040", name: "JBS (Jubilee Bus Station)", lat: 17.44746, lng: 78.49645 },
    { id: "1574", name: "Secunderabad Station", lat: 17.43695, lng: 78.50511 },
    { id: "1214", name: "RTC X Road", lat: 17.40862, lng: 78.49762 },
    { id: "937", name: "Uppal X Road", lat: 17.40159, lng: 78.55916 },
    { id: "749", name: "MGBS (Mahatma Gandhi Bus Station)", lat: 17.37774, lng: 78.48277 },
    { id: "1583", name: "Afzalgunj", lat: 17.37294, lng: 78.47673 },
    { id: "1408", name: "Zoo Park", lat: 17.35058, lng: 78.45243 },
    { id: "2141", name: "Dilsukh Nagar Depot", lat: 17.36962, lng: 78.52541 },
    { id: "305", name: "JNTU / Mahavir Hospital", lat: 17.40333, lng: 78.45635 },
    { id: "311", name: "Apollo Hospital", lat: 17.41805, lng: 78.41336 },
    { id: "332", name: "Peddamma Temple", lat: 17.43111, lng: 78.4074 },
    { id: "929", name: "Amberpet", lat: 17.39234, lng: 78.51688 },
    { id: "1466", name: "Kachiguda Station", lat: 17.39058, lng: 78.49894 },
    { id: "1406", name: "Puranapool", lat: 17.36491, lng: 78.45706 },
    { id: "222A", name: "Lingampally to Koti (Example Route)", lat: 0, lng: 0 }, // Helpful aliases
    { id: "219", name: "Patancheru to Secunderabad (Example Route)", lat: 0, lng: 0 }
];

export const searchBusStops = (query: string): BusStop[] => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return HYD_BUS_STOPS.filter(stop =>
        stop.name.toLowerCase().includes(lower) ||
        stop.id.toLowerCase().includes(lower)
    );
};

// Static Rules for Common Routes (Fallback when no AI Key)
export const GET_STATIC_ROUTE = (destination: string) => {
    const dest = destination.toLowerCase();

    // Koti / Abids / MGBS -> 222A via Panjagutta
    if (dest.includes('koti') || dest.includes('abids') || dest.includes('mgbs')) {
        return {
            busNumbers: ["222A", "222L"],
            frequency: "Every 15 mins",
            estimatedTime: "1 hr 30 mins",
            steps: [
                "Board Bus 222A at Campus Gate / Gandimaisamma.",
                "Direct bus to Koti Bus Stand via JNTU, Panjagutta.",
                "Get down at Koti Womens College."
            ]
        };
    }

    // Secunderabad / JBS / Tivoli -> 219, 226
    if (dest.includes('secunderabad') || dest.includes('jbs') || dest.includes('station')) {
        return {
            busNumbers: ["219", "226", "10K"],
            frequency: "Every 20 mins",
            estimatedTime: "1 hr 15 mins",
            steps: [
                "Board Bus 219/226 at Gandimaisamma X Road.",
                "Route goes via Balanagar, Paradise.",
                "Get down at Secunderabad Station / Rathifile."
            ]
        };
    }

    // JNTU / Kukatpally / Miyapur -> 225L
    if (dest.includes('jntu') || dest.includes('kukatpally') || dest.includes('miyapur') || dest.includes('hitech')) {
        return {
            busNumbers: ["225L", "19M"],
            frequency: "Every 10 mins",
            estimatedTime: "45 mins",
            steps: [
                "Board Bus 225L at Campus Stop.",
                "Get down at JNTU Metro Station.",
                "Connect to Metro Red Line if going to Hitech City."
            ]
        };
    }

    // BHEL / Patancheru / Lingampally
    if (dest.includes('bhel') || dest.includes('patancheru') || dest.includes('lingampally')) {
        return {
            busNumbers: ["219", "218"],
            frequency: "Every 15 mins",
            estimatedTime: "40 mins",
            steps: [
                "Board Bus 219 or 218 at Gandimaisamma X Road.",
                "Route goes via Patancheru.",
                "Get down at BHEL Bus Depot."
            ]
        };
    }

    // Mehdipatnam / Gachibowli
    if (dest.includes('mehdipatnam') || dest.includes('gachibowli') || dest.includes('tolichowki')) {
        return {
            busNumbers: ["216", "217"],
            frequency: "Every 20 mins",
            estimatedTime: "1 hr 10 mins",
            steps: [
                "Take shuttle to Gandimaisamma.",
                "Board Bus 216 towards Mehdipatnam.",
                "Route goes via Gachibowli ORR junction."
            ]
        };
    }

    // ECIL / AS Rao Nagar / Tirumalgherry
    if (dest.includes('as rao') || dest.includes('ecil') || dest.includes('tirumalgherry')) {
        return {
            busNumbers: ["24S", "24E/281"],
            frequency: "Every 30 mins",
            estimatedTime: "1 hr 45 mins",
            steps: [
                "Board Bus 219 to Secunderabad Station.",
                "Change to Bus 24S or 24E towards ECIL X Roads.",
                "Get down at AS Rao Nagar / Dr. A.S. Rao Nagar Bus Stop."
            ]
        };
    }

    // Charminar / Old City / Mecca Masjid
    if (dest.includes('charminar') || dest.includes('old city') || dest.includes('high court') || dest.includes('salan')) {
        return {
            busNumbers: ["8A", "2Z"],
            frequency: "Every 15 mins",
            estimatedTime: "1 hr 30 mins",
            steps: [
                "Board Bus 219 or 225L to Secunderabad Station or Afzalgunj.",
                "From Secunderabad: Take Bus 8A or 2Z direct to Charminar.",
                "From Afzalgunj: Walk across bridge or take auto (5 mins)."
            ]
        };
    }

    // Tank Bund / Secretariat / Birla Mandir
    if (dest.includes('tank bund') || dest.includes('secretariat') || dest.includes('birla') || dest.includes('ntr')) {
        return {
            busNumbers: ["5K", "83J"],
            frequency: "Every 12 mins",
            estimatedTime: "1 hr 10 mins",
            steps: [
                "Reach Secunderabad Station (Bus 219).",
                "Take Bus 5K or 83J towards Secretariat.",
                "Get down at Tank Bund / Ambedkar Statue stop."
            ]
        };
    }

    // Golconda Fort
    if (dest.includes('golconda') || dest.includes('fort') || dest.includes('toli')) {
        return {
            busNumbers: ["66G", "65G"],
            frequency: "Every 45 mins",
            estimatedTime: "1 hr 40 mins",
            steps: [
                "Take Bus 216 to Mehdipatnam.",
                "Change to Bus 66G at Mehdipatnam Bus Depot.",
                "Direct bus to Golconda Fort Main Gate."
            ]
        };
    }

    // Ameerpet / Panjagutta / SR Nagar
    if (dest.includes('ameerpet') || dest.includes('panjagutta') || dest.includes('sr nagar') || dest.includes('maitre')) {
        return {
            busNumbers: ["219", "225L", "Metro Red"],
            frequency: "Every 10 mins",
            estimatedTime: "55 mins",
            steps: [
                "Board Bus 219 or 225L to Miyapur Metro Station.",
                "Take Metro (Red Line) towards LB Nagar.",
                "Get down at Ameerpet Metro Station."
            ]
        };
    }

    // Uppal / Boduppal / Ramanthapur
    if (dest.includes('uppal') || dest.includes('boduppal') || dest.includes('habsiguda')) {
        return {
            busNumbers: ["113M", "113K"],
            frequency: "Every 20 mins",
            estimatedTime: "1 hr 40 mins",
            steps: [
                "Board Bus 113M/K to Secunderabad Station.",
                "Change to Bus 219 or 225L towards Patancheru.",
                "Get down at Gandimaisamma / Bowrampet."
            ]
        };
    }

    // LB Nagar / Dilsukhnagar / Malakpet
    if (dest.includes('lb nagar') || dest.includes('dilsukhnagar') || dest.includes('malakpet') || dest.includes('kothapet')) {
        return {
            busNumbers: ["Metro Red", "290U"],
            frequency: "Every 5-8 mins (Metro)",
            estimatedTime: "1 hr 30 mins",
            steps: [
                "Take Metro (Red Line) from LB Nagar/Dilshuknagar to Miyapur.",
                "Get down at Miyapur Metro Station.",
                "Take Bus 225L or Shared Auto to Bowrampet."
            ]
        };
    }

    // Kompally / Medchal / Alwal
    if (dest.includes('kompally') || dest.includes('medchal') || dest.includes('alwal') || dest.includes('suchitra')) {
        return {
            busNumbers: ["229", "227"],
            frequency: "Every 15 mins",
            estimatedTime: "50 mins",
            steps: [
                "Board Bus 229 towards Secunderabad.",
                "Get down at Suchitra Circle.",
                "Take Shared Auto or Bus to Bowrampet (via Jeedimetla)."
            ]
        };
    }

    // Manikonda / Shaikpet / Jubilee Hills
    if (dest.includes('manikonda') || dest.includes('shaikpet') || dest.includes('jubilee')) {
        return {
            busNumbers: ["47L", "127K"],
            frequency: "Every 25 mins",
            estimatedTime: "1 hr 15 mins",
            steps: [
                "Reach Mehdipatnam or Shaikhpet Dargah.",
                "Board Bus 216 towards Lingampally/Gachibowli.",
                "Connect to Bus 219 at Gachibowli OR take Metro Blue Line to Hitech City."
            ]
        };
    }

    // Abids / Nampally / Mozamjahi Market
    if (dest.includes('abids') || dest.includes('nampally') || dest.includes('mj market')) {
        return {
            busNumbers: ["8M", "8R"],
            frequency: "Every 15 mins",
            estimatedTime: "1 hr 20 mins",
            steps: [
                "Board Bus 8M to Secunderabad Station.",
                "Change to Bus 219 towards Patancheru.",
                "Get down at Bowrampet X Roads."
            ]
        };
    }

    // Falaknuma / Chandrayangutta
    if (dest.includes('falaknuma') || dest.includes('chandrayangutta')) {
        return {
            busNumbers: ["8F", "8C"],
            frequency: "Every 20 mins",
            estimatedTime: "2 hrs",
            steps: [
                "Board Bus 8F to Secunderabad Station.",
                "Change to Bus 219 or 225L.",
                "Long journey: Recommend taking MMTS to Hitech City then bus."
            ]
        };
    }

    // Default smart fallback
    return null;
};
