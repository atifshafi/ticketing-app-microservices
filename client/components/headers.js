import Link from 'next/link';

export default ({currentUser}) => {
    var links;
    if (currentUser) {
        links = <li className="nav-item">
                    <Link href="/auth/signout">
                        <a className="nav-link">Sign Out</a>
                    </Link>
                </li>
    } else {
        links = <>
                    <li className="nav-item">
                        <Link href="/auth/signin">
                            <a className="nav-link">Sign In</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/auth/signup">
                            <a className="nav-link">Sign Up</a>
                        </Link>
                    </li>
                </>
    }
    return <nav className="navbar navbar-light bg-light">
        <Link href="/">
            <a className="navbar-brand">GitTix</a>
        </Link>
        <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">
                {links}
            </ul>
        </div>

    </nav>

}