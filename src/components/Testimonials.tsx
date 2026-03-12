'use client';

import { useState, useEffect } from 'react';
import styles from './Testimonials.module.css';

export default function Testimonials() {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      });
  }, []);

  const featured = testimonials.filter(t => t.featured && t.approved);
  
  if (!loading && featured.length === 0) {
    return null;
  }

  const displayList = featured;

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>What Your Neighbors Say</h2>
        <div className={styles.badgesRow}>
          <div className={styles.googleBadge}>
            <div className={styles.gLogo}>G</div>
            <div className={styles.badgeInfo}>
              <span className={styles.rating}>5.0 ★★★★★</span>
              <span className={styles.reviewCount}>Google Reviews</span>
            </div>
          </div>
          <div className={styles.nextdoorBadge}>
            <span className={styles.ndIcon} aria-hidden="true">🏡</span>
            <div className={styles.badgeInfo}>
              <span className={styles.rating}>Highly Favoured</span>
              <span className={styles.reviewCount}>on Nextdoor</span>
            </div>
          </div>
          <div className={styles.fbBadge}>
            <span className={styles.fbIcon} aria-hidden="true">f</span>
            <div className={styles.badgeInfo}>
              <span className={styles.rating}>Active Community Member</span>
              <span className={styles.reviewCount}>Local Facebook Groups</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {displayList.map((review, i) => (
          <figure key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>{review.author[0]}</div>
              <div className={styles.trustBadge}>Verified Neighbor</div>
            </div>
            <div className={styles.stars}>
              {[...Array(review.stars)].map((_, index) => (
                <span key={index} aria-hidden="true">★</span>
              ))}
            </div>
            {review.videoUrl ? (
              <div className={styles.videoWrapper}>
                <iframe 
                  src={review.videoUrl} 
                  title={`Video testimonial from ${review.author}`}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <blockquote className={styles.quote}>&quot;{review.text}&quot;</blockquote>
            )}
            <figcaption className={styles.author}>
              <strong>{review.author}</strong>, {review.location}
            </figcaption>
          </figure>
        ))}
      </div>
      
      <div className={styles.viewMore}>
        <a href="https://google.com/search?q=Consider IT Fixed+Felpham+Reviews" target="_blank" rel="noopener noreferrer" className={styles.moreLink}>
          View all reviews on Google →
        </a>
      </div>
    </section>
  );
}