import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader } from 'lucide-react';
import EventDetails from '../../components/domain/ticket-detail/EventDetails';
import TicketSidebar from '../../components/domain/ticket-detail/TicketSidebar';
import bookingService from '../../services/booking.service';

function TicketDetail() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [tickets, setTickets] = useState([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await bookingService.getMyTickets();
        const orderTickets = response.filter(t => t.orderCode === orderCode);
        
        if (orderTickets.length === 0) {
          navigate('/attendee/my-tickets');
          return;
        }
        
        setTickets(orderTickets);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderCode) {
      fetchTickets();
    }
  }, [orderCode, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E5E1DA] text-[#131516] font-sans flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-[#8aa8b2]" />
      </div>
    );
  }

  const currentTicket = tickets[currentTicketIndex];

  return (
    <div className="min-h-screen text-[#131516] font-sans">
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="bg-white rounded-[28px] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
          <EventDetails ticket={currentTicket} user={user} />
          <TicketSidebar 
            ticket={currentTicket} 
            totalTickets={tickets.length}
            currentIndex={currentTicketIndex}
            onNext={() => setCurrentTicketIndex(prev => (prev + 1) % tickets.length)}
            onPrev={() => setCurrentTicketIndex(prev => (prev - 1 + tickets.length) % tickets.length)}
          />
        </div>
      </main>
    </div>
  );
}

export default TicketDetail;