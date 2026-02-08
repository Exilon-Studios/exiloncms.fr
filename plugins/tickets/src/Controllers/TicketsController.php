<?php

namespace ExilonCMS\Plugins\Tickets\Controllers;

use ExilonCMS\Plugins\Tickets\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Tickets Controller
 * Handles user ticket viewing and creation
 */
class TicketsController
{
    /**
     * Display user's tickets
     */
    public function index()
    {
        $tickets = Auth::user()->tickets()->latest()->paginate(10);

        return inertia('Tickets/Index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Show ticket creation form
     */
    public function create()
    {
        $categories = config('tickets.categories', []);

        return inertia('Tickets/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a new ticket
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'message' => 'required|string',
        ]);

        $ticket = Auth::user()->tickets()->create([
            'title' => $request->title,
            'category' => $request->category,
            'priority' => $request->priority,
            'status' => 'open',
        ]);

        $ticket->messages()->create([
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        return redirect()->route('tickets.show', ['id' => $ticket->id])
            ->with('success', 'Ticket created successfully!');
    }

    /**
     * Display a specific ticket
     */
    public function show($id)
    {
        $ticket = Auth::user()->tickets()->with('messages.user')->findOrFail($id);

        return inertia('Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }
}
