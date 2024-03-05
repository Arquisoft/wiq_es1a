import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to wiq_es1a/i);
  expect(linkElement).toBeInTheDocument();
});

describe('App Routing', () => {
  it('renders Authenticate component when path is /', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Authenticate />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText(/Authenticate/i)).toBeInTheDocument();
  });

  it('renders Home component when path is /home', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  it('renders Clasico component when path is /home/clasico', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path='/home/clasico' element={<Clasico />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText(/Clasico/i)).toBeInTheDocument();
  });

  it('renders Bateria component when path is /home/bateria', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path='/home/bateria' element={<Bateria />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText(/Bateria/i)).toBeInTheDocument();
  });

  it('renders Stats component when path is /stats', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path='/stats' element={<Stats />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText(/Stats/i)).toBeInTheDocument();
  });

  it('renders WrongRoute component when path is not recognized', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<WrongRoute />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText(/Wrong Route/i)).toBeInTheDocument();
  });
});