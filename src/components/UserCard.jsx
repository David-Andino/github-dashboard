import { Users, MapPin, Link, Twitter, Building2, BookOpen } from 'lucide-react'
import styles from './UserCard.module.css'

function Stat({ label, value }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statVal}>{value?.toLocaleString() ?? '—'}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export function UserCard({ user }) {
  return (
    <div className={`${styles.card} fade-up`}>
      <div className={styles.top}>
        <img src={user.avatar_url} alt={user.login} className={styles.avatar} />
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{user.name || user.login}</h2>
            <a href={user.html_url} target="_blank" rel="noreferrer" className={styles.ghLink}>
              @{user.login}
            </a>
          </div>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
          <div className={styles.meta}>
            {user.company && (
              <span className={styles.metaItem}><Building2 size={13} />{user.company}</span>
            )}
            {user.location && (
              <span className={styles.metaItem}><MapPin size={13} />{user.location}</span>
            )}
            {user.blog && (
              <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                 target="_blank" rel="noreferrer" className={styles.metaItem}>
                <Link size={13} />{user.blog.replace(/^https?:\/\//, '')}
              </a>
            )}
            {user.twitter_username && (
              <a href={`https://twitter.com/${user.twitter_username}`}
                 target="_blank" rel="noreferrer" className={styles.metaItem}>
                <Twitter size={13} />@{user.twitter_username}
              </a>
            )}
          </div>
        </div>
      </div>
      <div className={styles.stats}>
        <Stat label="Repositorios" value={user.public_repos} />
        <Stat label="Seguidores" value={user.followers} />
        <Stat label="Siguiendo" value={user.following} />
        <Stat label="Gists" value={user.public_gists} />
      </div>
    </div>
  )
}
