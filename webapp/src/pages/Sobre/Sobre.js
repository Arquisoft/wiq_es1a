import React from "react";
import "./Sobre.css";
import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';

const Sobre = () => {
  const designers = [
    { name: 'Martín Cancio Barrera', id: 'UO287561', github: 'https://github.com/CANCI0' },
    { name: 'Iyán Fernández Riol', id: 'UO288231', github: 'https://github.com/iyanfdezz' },
    { name: 'Rodrigo García Iglesias', id: 'UO276396', github: 'https://github.com/Rodrox11' }
  ];

  return (
    <>
      <Nav />
      <div className="sobre-container">
        <h1>Equipo WIQ_es1a</h1>
        <h2>Nuestro equipo de desarrollo</h2>
        <table className="designers-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>UO</th>
              <th>GitHub</th>
            </tr>
          </thead>
          <tbody>
            {designers.map((designer, index) => (
              <tr key={index}>
                <td>{designer.name}</td>
                <td>{designer.id}</td>
                <td><a href={designer.github} target="_blank" rel="noopener noreferrer">Mi GitHub</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Sobre;