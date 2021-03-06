import React, { useState, useEffect } from 'react';
import api from './services/api';
certo
function App() {

  const [userSearch, setUserSearch] = useState([]);
  const [results, setResults] = useState(false);
  const [user, setUser] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [starred, setStarred] = useState([]);
  const [ showRepositories, setShowRepositories ] = useState(true);
  const [ showStarred, setShowStarred ] = useState(true);

  async function searchingData(event) {
    event.preventDefault();

    if (!userSearch) {
      alert('Você deve informar o nome do usuário !');
      return;
    }

    try {
      const response = await api.get(`/${userSearch}`);
      setUser(response.data);
      setUserSearch('');
      setResults(true);
    } catch (err) {
      alert('Usuário não encontrado ou inexistente!');
      setUserSearch('');
    }
  }

  useEffect(() => {
    async function gettingRepo() {
        try {
          const response = await api.get(`/${user.login}/repos`);
          setRepositories(response.data);
        } catch (err) {
          alert('Ocorreu um erro ao buscar os repositórios.')
        }
    }
    gettingRepo();
  }, [user]);


  useEffect(() => {
    async function gettingStarred() {
        try {
          const response = await api.get(`/${user.login}/starred`);
          setStarred(response.data);
        } catch (err) {
          alert('Ocorreu um erro ao buscar os repositórios.')
        }
    }
    gettingStarred();
  }, [user]);



  return (
    <div className="Main">
      <h1 className='Main__title'>Github Finder</h1>
      <form className='formSearch' onSubmit={(event) => searchingData(event)}>
        <input
          className='formSearch__input'
          placeholder='Nome do usuário'
          value={userSearch}
          onChange={(event) => setUserSearch(event.target.value)}
        />
        <button className='formSearch__button formSearch__button--hover'>Search</button>
      </form>
      {results ? (
        <div>
          <section className='profile'>
            <div className='profile__avatar'>
              <img
                src={user.avatar_url}
                alt="Usuário"
              />
            </div>
            <div className='profile__details'>
              <p><b>Nome:</b> {user.name}</p>
              <p><b>Usuário:</b> {user.login} </p>
              <p><b>Biografia:</b> {user.bio === null ? 'Informação não encontrada ou inexistente.' : user.bio} </p>
              <a
                className='profile__link profile__link--hover profile__link--visited'
                href={user.html_url}
                rel='noreferrer'
                target='_blank'
              >
                Visite o perfil
              </a>
            </div>
          </section>
          <div>
              <button onClick={() => setShowRepositories(!showRepositories)}>Repositories</button>
              {showRepositories ? null : 
                <>
                  {repositories.map(repo => (
                      <div className='listResults__item' key={repo.id}>
                        {/* <img
                          src={repo.owner.avatar_url}
                          alt="User"
                        /> */}
                        <div className='listResults__description'>
                          <p>{repo.name}</p>
                        </div>
                      </div>
                    ))};
                </>
              }
          </div>
          <div>
              <button onClick={() => setShowStarred(!showStarred)}>Starred</button>
              {showStarred ? null : 
                <>
                  {starred.map(star => (
                    <div className='listResults__item' key={star.id}>
                      <img
                        src={star.owner.avatar_url}
                        alt="User"
                      />
                      <div className='listResults__description'>
                        <p>{star.owner.login}</p>
                        <p>{star.name}</p>
                      </div>
                    </div>
                  ))}
                </>
              }
          </div>
        </div>
    ) : null}
    </div>
  );
}

export default App;