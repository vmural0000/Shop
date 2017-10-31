namespace DAL.Models
{
    public enum OrderStatus
    {
        New,
        Processing,
        NotResponding,
        CallBack,
        Agreed,
        Paid,
        Completed,
        Sent,
        Done,
        Paused,
        Canceled
    }
}