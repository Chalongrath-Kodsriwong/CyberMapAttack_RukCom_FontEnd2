import React, { useState, useEffect } from "react";
import "../components/css/CountryAttack.css";
import "../components/JS/CountryAttack_Fun.js"; // Import ไว้เพื่อให้ใช้ jQuery ฟังก์ชัน
import { setupCountryAttackAnimation } from "../components/JS/CountryAttack_Fun.js"; // เพิ่มฟังก์ชันที่ export
import axios from "axios";

// Map country names to image paths
const countryFlags = {
  "United States": "/flags/United States of America.png",
  Bulgaria: "/flags/bulgaria.png",
  China: "/flags/china.png",
  Germany: "/flags/germany.png",
  Netherlands: "/flags/netherlands.png",
  Russia: "/flags/russia.png",
  "United Kingdom": "/flags/unitedkingdom.png",
  Thailand: "/flags/Thailand.png",
  Singapore: "/flags/singapore.png",
  Belgium: "/flags/belgium.png",
  India: "/flags/india.png",
  Brazil: "/flags/brazil.png",
  "The Netherlands": "/flags/netherlands.png",
  Canada: "/flags/canada.png",
  France: "/flags/france.png",
  "South Korea": "/flags/southkorea.png",
  Vietnam: "/flags/vietnam.png",
  Ukraine: "/flags/ukraine.png",
  Japan: "/flags/japan.png",
  Taiwan: "/flags/taiwan.png",
  Czechia: "/flags/czech.png",
  "Hong Kong": "/flags/hongkong.png",
  Italy: "/flags/italy.png",
  Romania: "/flags/romania.png",
  Cyprus: "/flags/cyprus.png",
  Sweden: "/flags/sweden.png",
  Spain: "/flags/spain.png",
  Pakistan: "/flags/pakistan.png",
  Israel: "/flags/israel.png",
  Australia: "/flags/australia.png",
  Poland: "/flags/poland.png",
  Malaysia: "/flags/malaysia.png",
  "South Africa": "/flags/southafrica.png",
  Switzerland: "/flags/switzerland.png",
  Norway: "/flags/norway.png",
  Ireland: "/flags/ireland.png",
  "United Arab Emirates": "/flags/unitedarabemirates.png",
  Peru: "/flags/peru.png",
  Denmark: "/flags/denmark.png",
  Iran: "/flags/iran.png",
  Bangladesh: "/flags/bangladesh.png",
  Turkey: "/flags/turkey.png",
  Finland: "/flags/finland.png",
  Indonesia: "/flags/indonesia.png",
  "Republic of Lithuania": "/flags/lithuania.png",
  Latvia: "/flags/latvia.png",
  Portugal: "/flags/portugal.png",
  Ethiopia: "/flags/ethiopia.png",
  Lithuania: "/flags/lithuania.png",
  Nigeria: "/flags/nigeria.png",
  Mexico: "/flags/mexico.png",
  Kazakhstan: "/flags/kazakhstan.png",
  Argentina: "/flags/argentina.png",
  Cambodia: "/flags/cambodia.png",
  Lebanon: "/flags/lebanon.png",
  Iraq: "/flags/iraq.png",
  "Republic of Moldova": "/flags/moldova.png",
  Uzbekistan: "/flags/uzbekistan.png",
  Georgia: "/flags/georgia.png",
  Azerbaijan: "/flags/azerbaijan.png",
  Philippines: "/flags/philippines.png",
  Tunisia: "/flags/tunisia.png",
  Türkiye: "/flags/turkey (1).png",
  Austria: "/flags/austria.png",
  Colombia: "/flags/colombia.png",
  Mozambique: "/flags/mozambique.png",
  Luxembourg: "/flags/luxembourg.png",
  Chile: "/flags/chile.png",
  Seychelles: "/flags/seychelles.png",
  Algeria: "/flags/algeria.png",
  "Sri Lanka": "/flags/srilanka.png",
  Greece: "/flags/greece.png",
  Afghanistan: "/flags/afghanistan.png",
  Tanzania: "/flags/tanzania.png",
  Brunei: "/flags/brunei.png",
  "Costa Rica": "/flags/costarica.png",
  Morocco: "/flags/morocco.png",
  Croatia: "/flags/croatia.png",
  Senegal: "/flags/senegal.png",
  Bolivia: "/flags/bolivia.png",
  Panama: "/flags/panama.png",
  "New Zealand": "/flags/newzealand.png",
  Mongolia: "/flags/mongolia.png",
  Uganda: "/flags/uganda.png",
  Estonia: "/flags/estonia.png",
  Hungary: "/flags/hungary.png",
  "Bosnia and Herzegovina": "/flags/bosniaandherzegovina.png",
  Moldova: "/flags/moldova.png",
  Belarus: "/flags/belarus.png",
  Nicaragua: "/flags/nicaragua.png",
  "El Salvador": "/flags/elsalvador.png",
  Gambia: "/flags/gambia.png",
  Mali: "/flags/mali.png",
  "Saudi Arabia": "/flags/saudiarabia.png",
  Macao: "/flags/macao.png",
  Slovakia: "/flags/slovakia.png",
  Zambia: "/flags/zambia.png",
  Armenia: "/flags/armenia.png",
  "Puerto Rico": "/flags/puertorico.png",
  Ecuador: "/flags/ecuador.png",
  "Dominican Republic": "/flags/dominicanrepublic.png",
  Bahrain: "/flags/bahrain.png",
  Egypt: "/flags/egypt.png",
  Zimbabwe: "/flags/zimbabwe.png",
  Turkmenistan: "/flags/turkmenistan.png",
  Kenya: "/flags/kenya.png",
  Liberia: "/flags/liberia.png",
  Cameroon: "/flags/cameroon.png",
  Kuwait: "/flags/kuwait.png",
  Uruguay: "/flags/uruguay.png",
  Libya: "/flags/libya.png",
  Syria: "/flags/syria.png",
  Niger: "/flags/niger.png",
  "Trinidad and Tobago": "/flags/trinidadandtobago.png",
  "Hashemite Kingdom of Jordan": "/flags/jordan.png",
  Venezuela: "/flags/venezuela.png",
  Serbia: "/flags/serbia.png",
  Iceland: "/flags/iceland.png",
  Laos: "/flags/laos.png",
  Nepal: "/flags/nepal.png",
  Slovenia: "/flags/slovenia.png",
  Albania: "/flags/albania.png",
  "Sierra Leone": "/flags/sierraleone.png",
  "Turks and Caicos Islands": "/flags/turksandcaicosislands.png",
  "Cabo Verde": "/flags/caboverde.png",
  Mauritius: "/flags/mauritius.png",
  Ghana: "/flags/ghana.png",
  Eritrea: "/flags/eritrea.png",
  Jersey: "/flags/jersey.png",
  "Ivory Coast": "/flags/ivorycoast.png",
  Maldives: "/flags/maldives.png",
  Guadeloupe: "/flags/guadeloupe.png",
  Oman: "/flags/oman.png",
  Andorra: "/flags/andorra.png",
  Kyrgyzstan: "/flags/kyrgyzstan.png",
  Mauritania: "/flags/mauritania.png",
  Rwanda: "/flags/rwanda.png",
  Jamaica: "/flags/jamaica.png",
  "Saint Martin": "/flags/saintmartin.png",
  "Cayman Islands": "/flags/caymanislands.png",
  Myanmar: "/flags/myanmar.png",
  Malta: "/flags/malta.png",
  Bahamas: "/flags/bahamas.png",
  Guatemala: "/flags/guatemala.png",
  Bermuda: "/flags/bermuda.png",
  "North Macedonia": "/flags/northmacedonia.png",
  Honduras: "/flags/honduras.png",
  Belize: "/flags/belize.png",
  Cuba: "/flags/cuba.png",
  Qatar: "/flags/qatar.png",
  "Bonaire, Sint Eustatius, and Saba": "/flags/sabaisland.png",
  Monaco: "/flags/monaco.png",
  Aruba: "/flags/aruba.png",
  Malawi: "/flags/malawi.png",
  Barbados: "/flags/barbados.png",
  "Equatorial Guinea": "/flags/equatorialguinea.png",
  "British Virgin Islands": "/flags/britishvirginislands.png",
  Angola: "/flags/angola.png",
  Bhutan: "/flags/bhutan.png",
  Jordan: "/flags/jordan.png",
  Eswatini: "/flags/eswatini.png",
  "Wallis and Futuna": "/flags/wallisandfutuna.png",
  Montenegro: "/flags/montenegro.png",
  "Saint Pierre and Miquelon": "/flags/saintpierreandmiquelon.png",
  Comoros: "/flags/comoros.png",
  "Burkina Faso": "/flags/burkinafaso.png",
  Gibraltar: "/flags/gibraltar.png",
  Kosovo: "/flags/kosovo.png",
  Palestine: "/flags/palestine.png",
  Tajikistan: "/flags/tajikistan.png",
  Somalia: "/flags/somalia.png",
  Botswana: "/flags/botswana.png",
  Namibia: "/flags/namibia.png",
  Paraguay: "/flags/paraguay.png",
  Réunion: "/flags/france.png",
  "Isle of Man": "/flags/isleofman.png",
  Madagascar: "/flags/madagascar.png",
  "New Caledonia": "/flags/newcaledonia.png",
  "St Kitts and Nevis": "/flags/saintkitts.png",
  Suriname: "/flags/suriname.png",
  Palau:"/flags/palau.png",
  "Congo Republic": "/flags/congorepublic.png",
  "Northern Mariana Islands": "/flags/northernmarianaislands.png",
  Liechtenstein: "/flags/liechtenstein.png",
  "U.S. Virgin Islands": "/flags/usvirginislands.png",


  Default: "/flags/default.png",
};

function Country_Attack() {
  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/today-attacks`);
      const data = response.data;

      const formattedCountries = data.map((item) => ({
        name: item.country,
        count: item.count,
        flag: countryFlags[item.country] || countryFlags["Default"],
      }));

      setCountries(formattedCountries);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  useEffect(() => {
    fetchCountries();

    const intervalId = setInterval(() => {
      fetchCountries();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setupCountryAttackAnimation(); // เรียกใช้ฟังก์ชันที่ import มา
  }, []);

  return (
    <>
      <div className="table-container">
        <strong style={{marginTop: "5px"}}>TOP TARGETED COUNTRIES</strong>
        <table className="country-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>COUNTRY</th>
              <th>COUNT ATTACK</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={country.flag}
                    alt={`${country.name} Flag`}
                    onError={(e) => (e.target.src = "/flags/default.png")}
                  />
                  {country.name}
                </td>
                <td className="Count">{country.count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="btn_hideShow">
        <p className="TextCountry">Country <br /> Attacker</p>
        <p className="Arrow3">▼</p>
      </div>
    </>
  );
}

export default Country_Attack;
