
export default function Querry(enableWeb3) {
        return (
          <div>
            <div className="jumbotron d-flex align-items-center min-vh-100">
              <div className="container text-center">
                <button className="btn btn-primary" onClick={() => enableWeb3()}>Connect</button>
              </div>
            </div>
          </div>
        )
      }
