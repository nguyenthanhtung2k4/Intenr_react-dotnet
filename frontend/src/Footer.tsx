import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
      const currentYear = new Date().getFullYear();

      return (
            <footer
                  style={{
                        backgroundColor: 'var(--color-text-primary)',
                        color: 'white',
                        padding: 'var(--spacing-3xl) 0 var(--spacing-xl)',
                        marginTop: 'var(--spacing-3xl)',
                  }}
            >
                  <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                              {/* About Section */}
                              <div>
                                    <h3 className="text-lg font-bold mb-4">Bowling League</h3>
                                    <p className="text-sm opacity-80 leading-relaxed">
                                          Hệ thống quản lý giải đấu Bowling chuyên nghiệp. Theo dõi thống
                                          kê, xếp hạng và lịch thi đấu.
                                    </p>
                              </div>

                              {/* Quick Links */}
                              <div>
                                    <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                                    <ul className="space-y-2 text-sm">
                                          <li>
                                                <Link
                                                      to="/fixtures"
                                                      className="opacity-80 hover:opacity-100 transition-opacity"
                                                >
                                                      Fixtures
                                                </Link>
                                          </li>
                                          <li>
                                                <Link
                                                      to="/standings"
                                                      className="opacity-80 hover:opacity-100 transition-opacity"
                                                >
                                                      Standings
                                                </Link>
                                          </li>
                                          <li>
                                                <Link
                                                      to="/stats"
                                                      className="opacity-80 hover:opacity-100 transition-opacity"
                                                >
                                                      Player Stats
                                                </Link>
                                          </li>
                                          <li>
                                                <Link
                                                      to="/teams"
                                                      className="opacity-80 hover:opacity-100 transition-opacity"
                                                >
                                                      Teams
                                                </Link>
                                          </li>
                                    </ul>
                              </div>

                              {/* Contact Info */}
                              <div>
                                    <h3 className="text-lg font-bold mb-4">Contact</h3>
                                    <ul className="space-y-2 text-sm opacity-80">
                                          <li>Email: info@bowlingleague.com</li>
                                          <li>Phone: 0123 456 789</li>
                                          <li>Location: TP. Hồ Chí Minh</li>
                                    </ul>
                              </div>
                        </div>

                        {/* Copyright */}
                        <div
                              className="pt-6 text-center text-sm opacity-60"
                              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
                        >
                              © {currentYear} Bowling League. All rights reserved.
                        </div>
                  </div>
            </footer>
      );
}

export default Footer;
