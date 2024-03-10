import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router} from 'react-router-dom';
import Home from './pages/Home/Home.js';
import Nav from './components/Nav/Nav.js';
import Footer from './components/Footer/Footer.js';
import App from './App';

test('renders welcome mesagge', () => {
  render(<App />);
  const homemessage = screen.getByText(/Bienvenido/i);
  expect(homemessage).toBeInTheDocument();  
});

describe('Home Component', () => {
  test('renders welcome message and game links', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    // Verifica que el mensaje de bienvenida esté presente
    const welcomeMessage = screen.getByText(/Bienvenido/i);
    expect(welcomeMessage).toBeInTheDocument();

    // Verifica que los enlaces de los juegos estén presentes
    const gameLinks = screen.getAllByRole('link');
    expect(gameLinks.length).toBe(5); // Verifica que haya 5 enlaces + 4 que detecta del nav

    // Verifica el texto de cada enlace
    expect(screen.getByText('Clásico')).toBeInTheDocument();
    expect(screen.getByText('Batería de sabios')).toBeInTheDocument();
  });
});

// describe('Nav Component', () => {
//   it('renders Nav component with links and logout button', () => {
//     const { getByText, getByRole } = render( 
//     <Router>
//       <Nav />
//     </Router>
//   );

//     // Verificar que el logo esté presente
//     expect(getByText('WIQ!')).toBeInTheDocument();

//     // Verificar que los enlaces estén presentes
//     expect(getByText('Home')).toBeInTheDocument();
//     expect(getByText('Sobre nosotros')).toBeInTheDocument();
//     expect(getByText('Stats')).toBeInTheDocument();

//     // Verificar que el botón de logout esté presente y que sea un enlace al login
//     const logoutButton = getByRole('button', { name: /Desconectarse/i });
//     expect(logoutButton).toBeInTheDocument();
//     expect(logoutButton.closest('a')).toHaveAttribute('href', '/login');
//   });

//   it('calls localStorage.removeItem when logout button is clicked', () => {
//     // Mock de localStorage.removeItem
//     const removeItemMock = jest.fn();
//     Object.defineProperty(window, 'localStorage', {
//         value: { removeItem: removeItemMock },
//         writable: true
//     });

//     // Renderizar el componente Nav
//     const { getByRole } = render( 
//       <Router>
//         <Nav />
//       </Router>
//     );
//     const logoutButton = getByRole('button', { name: /Desconectarse/i });

//     // Simular clic en el botón de logout
//     fireEvent.click(logoutButton);

//     // Verificar que la función removeItem se haya llamado con 'token'
//     expect(removeItemMock).toHaveBeenCalledWith('token');
// });
// });
describe('Footer Component', () => {
  it('renders footer text correctly', () => {
    render(<Footer />);

    // Verificar que el texto del pie de página esté presente
    expect(screen.getByText('WIQ!')).toBeInTheDocument();
    expect(screen.getByText('Copyright 2024 ® Grupo 1A de Arquitectura del Software')).toBeInTheDocument();
  });
});
/*test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to wiq_es1a/i);
  expect(linkElement).toBeInTheDocument();
});*/

