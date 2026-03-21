# Proposal: Packing List Builder

## What I'm building
A packing list website that allows you to add items sorted by category (clothes, toiletries, documents, etc), check them off as you pack, and filter by packed/unpacked status.

## Who it's for / Why
I'm building this for myself because I travel often and many times I forget certain things that I needed to pack. I also always run into the problem of losing track of what I've already packed versus what still needs to be packed. Usually, I try to make a list on my reminders app but that does not filter it in the way that I would like, so this website would help me solve that.

## Core features
- Add items to the list by typing and pressing "Enter" or clicking "Add"
- Each item is assigned to a category (Clothing, Toiletries, Documents, Electronics, Health, Misc) and the list is split between these categories
- Once the items are packed, you can check them off the list and they will be striked through.
- The list will be able to be filtered between "all", "still needed", and "packed"
- You can also clear the whole list to start again for a new trip

## What I don't know yet
- How to store a list of objects in JavaScript and keep the display in sync when things change
- How filtering works without actually deleting items from the data
- How event listeners work on elements that are added to the page (not just elements that exist when the page loads)