'use client';

import { useState, useMemo } from 'react';
import styles from './PriceCalculator.module.css';
import { Calculator, Info } from 'lucide-react';

const SERVICES = [
  { id: 'general', name: 'General Support (per hour)', price: 40, unit: 'hr' },
  { id: 'device-setup', name: 'New Device Setup', price: 60, unit: 'fixed' },
  { id: 'remote-fix', name: 'Quick Remote Fix', price: 15, unit: 'fixed' },
  { id: 'tea-tech', name: 'Tea & Tech Lesson', price: 35, unit: 'hr' },
  { id: 'scam-safety', name: 'Scam Safety Check', price: 30, unit: 'fixed' },
];

export default function PriceCalculator() {
  const [selected, setSelected] = useState<{ id: string, quantity: number }[]>([]);
  const [isOver65, setIsOver65] = useState(false);

  const toggleService = (id: string) => {
    setSelected(prev => {
      const existing = prev.find(s => s.id === id);
      if (existing) {
        return prev.filter(s => s.id !== id);
      } else {
        return [...prev, { id, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setSelected(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, quantity: Math.max(1, s.quantity + delta) };
      }
      return s;
    }));
  };

  const { subtotal, discount, total } = useMemo(() => {
    let sum = 0;
    selected.forEach(s => {
      const service = SERVICES.find(srv => srv.id === s.id);
      if (service) {
        sum += service.price * s.quantity;
      }
    });

    // Apply Labour Cap logic (simplified for calculator)
    // If multiple general support hours, cap at £80
    const generalSupport = selected.find(s => s.id === 'general');
    if (generalSupport && generalSupport.quantity > 2) {
      const original = generalSupport.quantity * 40;
      sum -= (original - 80);
    }

    const discountAmount = isOver65 ? sum * 0.1 : 0;
    
    return {
      subtotal: sum,
      discount: discountAmount,
      total: sum - discountAmount
    };
  }, [selected, isOver65]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Calculator size={24} className={styles.icon} />
        <h3>Instant Price Estimate</h3>
      </div>

      <div className={styles.content}>
        <p className={styles.intro}>Select the services you need to get a rough idea of the cost.</p>
        
        <div className={styles.serviceList}>
          {SERVICES.map(service => {
            const isSelected = selected.some(s => s.id === service.id);
            const selection = selected.find(s => s.id === service.id);

            return (
              <div key={service.id} className={`${styles.serviceItem} ${isSelected ? styles.selected : ''}`}>
                <div className={styles.serviceInfo} onClick={() => toggleService(service.id)}>
                  <input type="checkbox" checked={isSelected} readOnly />
                  <span className={styles.serviceName}>{service.name}</span>
                  <span className={styles.servicePrice}>£{service.price}</span>
                </div>
                
                {isSelected && service.unit === 'hr' && (
                  <div className={styles.quantity}>
                    <button onClick={() => updateQuantity(service.id, -1)}>-</button>
                    <span>{selection?.quantity} hr(s)</span>
                    <button onClick={() => updateQuantity(service.id, 1)}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.options}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={isOver65} onChange={(e) => setIsOver65(e.target.checked)} />
            <span>Apply 10% Senior Discount (Over 65s)</span>
          </label>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className={`${styles.summaryRow} ${styles.discount}`}>
              <span>Senior Discount</span>
              <span>-£{discount.toFixed(2)}</span>
            </div>
          )}
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Estimated Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.disclaimer}>
          <Info size={16} />
          <p>This is an estimate. Final prices may vary based on specific issues and any parts required.</p>
        </div>
      </div>
    </div>
  );
}
